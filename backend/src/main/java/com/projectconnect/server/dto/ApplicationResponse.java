package com.projectconnect.server.dto;

import com.projectconnect.server.model.ApplicationStatus;
import com.projectconnect.server.model.ProjectApplication;
import com.projectconnect.server.model.User;

import java.time.LocalDateTime;

public class ApplicationResponse {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private UserSummaryDto applicant;
    private ApplicationStatus status;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ApplicationResponse() {}

    public static ApplicationResponse fromApplication(ProjectApplication app, User currentUser) {
        ApplicationResponse res = new ApplicationResponse();
        res.setId(app.getId());
        res.setProjectId(app.getProject().getId());
        res.setProjectTitle(app.getProject().getTitle());
        boolean isFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(app.getApplicant());
        res.setApplicant(UserSummaryDto.fromUser(app.getApplicant(), isFollowed));
        res.setStatus(app.getStatus());
        res.setMessage(app.getMessage());
        res.setCreatedAt(app.getCreatedAt());
        res.setUpdatedAt(app.getUpdatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public UserSummaryDto getApplicant() {
        return applicant;
    }

    public void setApplicant(UserSummaryDto applicant) {
        this.applicant = applicant;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
