package com.projectconnect.server.service;

import com.projectconnect.server.dto.NotificationResponse;
import com.projectconnect.server.model.Notification;
import com.projectconnect.server.model.NotificationType;
import com.projectconnect.server.model.User;
import com.projectconnect.server.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Notification createNotification(User recipient, User sender, NotificationType type, String message, String link) {
        if (recipient.getId().equals(sender != null ? sender.getId() : null)) {
            return null; // Don't notify self
        }

        Notification notification = new Notification(recipient, sender, type, message, link);
        Notification saved = notificationRepository.save(notification);

        if (messagingTemplate != null) {
            try {
                messagingTemplate.convertAndSendToUser(
                        recipient.getUsername(),
                        "/queue/notifications",
                        NotificationResponse.fromNotification(saved)
                );
            } catch (Exception ignored) {}
        }

        return saved;
    }

    public List<NotificationResponse> getUserNotifications(User recipient) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(recipient)
                .stream()
                .map(NotificationResponse::fromNotification)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(User recipient) {
        return notificationRepository.countByRecipientAndIsReadFalse(recipient);
    }

    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (notification.getRecipient().getId().equals(user.getId())) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(User recipient) {
        List<Notification> notifications = notificationRepository.findByRecipientOrderByCreatedAtDesc(recipient);
        for (Notification n : notifications) {
            n.setRead(true);
        }
        notificationRepository.saveAll(notifications);
    }
}
