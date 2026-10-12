package com.projectconnect.server.dto;

import com.projectconnect.server.model.Notification;
import com.projectconnect.server.model.NotificationType;

import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private UserSummaryDto sender;
    private NotificationType type;
    private String message;
    private String link;
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationResponse() {}

    public static NotificationResponse fromNotification(Notification notification) {
        NotificationResponse res = new NotificationResponse();
        res.setId(notification.getId());
        if (notification.getSender() != null) {
            res.setSender(UserSummaryDto.fromUser(notification.getSender(), false));
        }
        res.setType(notification.getType());
        res.setMessage(notification.getMessage());
        res.setLink(notification.getLink());
        res.setRead(notification.isRead());
        res.setCreatedAt(notification.getCreatedAt());
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

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
