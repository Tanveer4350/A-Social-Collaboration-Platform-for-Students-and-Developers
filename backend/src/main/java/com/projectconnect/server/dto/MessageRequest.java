package com.projectconnect.server.dto;

import jakarta.validation.constraints.NotBlank;

public class MessageRequest {
    private Long recipientId;
    private Long projectId;

    @NotBlank
    private String content;

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
