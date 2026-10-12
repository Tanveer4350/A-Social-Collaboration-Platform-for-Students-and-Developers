package com.projectconnect.server.service;

import com.projectconnect.server.dto.ConversationSummaryDto;
import com.projectconnect.server.dto.MessageRequest;
import com.projectconnect.server.dto.MessageResponse;
import com.projectconnect.server.dto.UserSummaryDto;
import com.projectconnect.server.model.*;
import com.projectconnect.server.repository.MessageRepository;
import com.projectconnect.server.repository.ProjectRepository;
import com.projectconnect.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public MessageResponse sendMessage(MessageRequest request) {
        User currentUser = userService.getCurrentUser();
        Message message = new Message();
        message.setSender(currentUser);
        message.setContent(request.getContent());

        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found: " + request.getProjectId()));

            // Verify membership
            boolean isMember = project.getOwner().getId().equals(currentUser.getId()) ||
                    (project.getMembers() != null && project.getMembers().contains(currentUser));
            if (!isMember) {
                throw new RuntimeException("Unauthorized: You must be a project team member to chat");
            }

            message.setProject(project);
            Message saved = messageRepository.save(message);
            MessageResponse response = MessageResponse.fromMessage(saved, currentUser);

            // Broadcast to project topic
            if (messagingTemplate != null) {
                try {
                    messagingTemplate.convertAndSend("/topic/project/" + project.getId(), response);
                } catch (Exception ignored) {}
            }

            return response;
        } else if (request.getRecipientId() != null) {
            User recipient = userRepository.findById(request.getRecipientId())
                    .orElseThrow(() -> new RuntimeException("Recipient not found: " + request.getRecipientId()));

            message.setRecipient(recipient);
            Message saved = messageRepository.save(message);
            MessageResponse response = MessageResponse.fromMessage(saved, currentUser);

            // Send to recipient's private queue
            if (messagingTemplate != null) {
                try {
                    messagingTemplate.convertAndSendToUser(
                            recipient.getUsername(),
                            "/queue/messages",
                            response
                    );
                } catch (Exception ignored) {}
            }

            // Create notification for recipient
            notificationService.createNotification(
                    recipient,
                    currentUser,
                    NotificationType.MESSAGE,
                    "New message from " + currentUser.getFullName() + ": \"" +
                            (request.getContent().length() > 35 ? request.getContent().substring(0, 32) + "..." : request.getContent()) + "\"",
                    "/messages?user=" + currentUser.getId()
            );

            return response;
        } else {
            throw new RuntimeException("Invalid message: Recipient or Project must be specified");
        }
    }

    @Transactional
    public List<MessageResponse> getDirectConversation(Long otherUserId) {
        User currentUser = userService.getCurrentUser();
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("User not found: " + otherUserId));

        List<Message> messages = messageRepository.findDirectConversation(currentUser, otherUser);

        // Mark unread received messages as read
        for (Message m : messages) {
            if (m.getRecipient() != null && m.getRecipient().getId().equals(currentUser.getId()) && !m.isRead()) {
                m.setRead(true);
            }
        }
        messageRepository.saveAll(messages);

        return messages.stream()
                .map(m -> MessageResponse.fromMessage(m, currentUser))
                .collect(Collectors.toList());
    }

    public List<MessageResponse> getProjectConversation(Long projectId) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        boolean isMember = project.getOwner().getId().equals(currentUser.getId()) ||
                (project.getMembers() != null && project.getMembers().contains(currentUser));
        if (!isMember) {
            throw new RuntimeException("Unauthorized: You must be a project member to view project chat");
        }

        return messageRepository.findByProjectOrderByCreatedAtAsc(project).stream()
                .map(m -> MessageResponse.fromMessage(m, currentUser))
                .collect(Collectors.toList());
    }

    public List<ConversationSummaryDto> getConversationsList() {
        User currentUser = userService.getCurrentUser();
        List<ConversationSummaryDto> summaries = new ArrayList<>();

        // Direct messages grouped by other user
        List<Message> allDirect = messageRepository.findAllDirectMessagesForUser(currentUser);
        Map<Long, List<Message>> userGrouped = new HashMap<>();

        for (Message m : allDirect) {
            Long otherId = m.getSender().getId().equals(currentUser.getId())
                    ? (m.getRecipient() != null ? m.getRecipient().getId() : null)
                    : m.getSender().getId();

            if (otherId != null) {
                userGrouped.computeIfAbsent(otherId, k -> new ArrayList<>()).add(m);
            }
        }

        for (Map.Entry<Long, List<Message>> entry : userGrouped.entrySet()) {
            Long otherUserId = entry.getKey();
            List<Message> list = entry.getValue();
            if (list.isEmpty()) continue;

            Message latest = list.get(0); // Ordered by createdAt DESC
            User otherUser = latest.getSender().getId().equals(currentUser.getId())
                    ? latest.getRecipient()
                    : latest.getSender();

            int unread = (int) list.stream()
                    .filter(m -> m.getRecipient() != null && m.getRecipient().getId().equals(currentUser.getId()) && !m.isRead())
                    .count();

            ConversationSummaryDto summary = new ConversationSummaryDto();
            summary.setType("DIRECT");
            boolean isFollowed = currentUser.getFollowing() != null && currentUser.getFollowing().contains(otherUser);
            summary.setOtherUser(UserSummaryDto.fromUser(otherUser, isFollowed));
            summary.setLastMessage(latest.getContent());
            summary.setLastMessageTime(latest.getCreatedAt());
            summary.setUnreadCount(unread);
            summaries.add(summary);
        }

        // Project messages
        List<Project> myProjects = projectRepository.findByOwnerOrderByCreatedAtDesc(currentUser);
        List<Project> joinedProjects = projectRepository.findByMember(currentUser);
        Set<Project> allUserProjects = new HashSet<>();
        allUserProjects.addAll(myProjects);
        allUserProjects.addAll(joinedProjects);

        for (Project p : allUserProjects) {
            List<Message> pMsgs = messageRepository.findByProjectOrderByCreatedAtAsc(p);
            ConversationSummaryDto summary = new ConversationSummaryDto();
            summary.setType("PROJECT");
            summary.setProjectId(p.getId());
            summary.setProjectTitle(p.getTitle());
            if (!pMsgs.isEmpty()) {
                Message last = pMsgs.get(pMsgs.size() - 1);
                summary.setLastMessage(last.getSender().getFullName() + ": " + last.getContent());
                summary.setLastMessageTime(last.getCreatedAt());
            } else {
                summary.setLastMessage("Project group chat initialized");
                summary.setLastMessageTime(p.getCreatedAt());
            }
            summary.setUnreadCount(0);
            summaries.add(summary);
        }

        summaries.sort((s1, s2) -> {
            if (s1.getLastMessageTime() == null) return 1;
            if (s2.getLastMessageTime() == null) return -1;
            return s2.getLastMessageTime().compareTo(s1.getLastMessageTime());
        });

        return summaries;
    }
}
