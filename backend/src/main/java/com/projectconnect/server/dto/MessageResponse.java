package com.projectconnect.server.dto;

import com.projectconnect.server.model.Message;
import com.projectconnect.server.model.User;

import java.time.LocalDateTime;

public class MessageResponse {
    private Long id;
    private UserSummaryDto sender;
    private UserSummaryDto recipient;
    private Long projectId;
    private String projectTitle;
    private String content;
    private boolean isRead;
    private boolean isSelf;
    private LocalDateTime createdAt;

    public MessageResponse() {}

    public static MessageResponse fromMessage(Message msg, User currentUser) {
        MessageResponse res = new MessageResponse();
        res.setId(msg.getId());
        res.setSender(UserSummaryDto.fromUser(msg.getSender(), false));
        if (msg.getRecipient() != null) {
            res.setRecipient(UserSummaryDto.fromUser(msg.getRecipient(), false));
        }
        if (msg.getProject() != null) {
            res.setProjectId(msg.getProject().getId());
            res.setProjectTitle(msg.getProject().getTitle());
        }
        res.setContent(msg.getContent());
        res.setRead(msg.isRead());
        res.setSelf(currentUser != null && currentUser.getId().equals(msg.getSender().getId()));
        res.setCreatedAt(msg.getCreatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserSummaryDto getSender() {
        return sender;
    }

    public void setSender(UserSummaryDto sender) {
        this.sender = sender;
    }

    public UserSummaryDto getRecipient() {
        return recipient;
    }

    public void setRecipient(UserSummaryDto recipient) {
        this.recipient = recipient;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public boolean isSelf() {
        return isSelf;
    }

    public void setSelf(boolean self) {
        isSelf = self;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
