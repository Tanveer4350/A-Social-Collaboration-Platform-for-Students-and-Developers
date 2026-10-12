package com.projectconnect.server.dto;

import java.time.LocalDateTime;

public class ConversationSummaryDto {
    private String type; // "DIRECT" or "PROJECT"
    private UserSummaryDto otherUser;
    private Long projectId;
    private String projectTitle;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private int unreadCount;

    public ConversationSummaryDto() {}

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public UserSummaryDto getOtherUser() {
        return otherUser;
    }

    public void setOtherUser(UserSummaryDto otherUser) {
        this.otherUser = otherUser;
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

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }

    public void setLastMessageTime(LocalDateTime lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }

    public int getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(int unreadCount) {
        this.unreadCount = unreadCount;
    }
}
