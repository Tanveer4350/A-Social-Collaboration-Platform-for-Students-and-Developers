package com.projectconnect.server.dto;

import com.projectconnect.server.model.Project;
import com.projectconnect.server.model.ProjectStatus;
import com.projectconnect.server.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class ProjectResponse {
    private Long id;
    private String title;
    private String tagLine;
    private String description;
    private UserSummaryDto owner;
    private ProjectStatus status;
    private int maxMembers;
    private int currentMembersCount;
    private String repositoryUrl;
    private String liveDemoUrl;
    private Set<String> requiredSkills;
    private Set<String> techStack;
    private List<UserSummaryDto> members;
    private boolean isOwner;
    private boolean isMember;
    private boolean hasApplied;
    private String applicationStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectResponse() {}

    public static ProjectResponse fromProject(Project project, User currentUser) {
        ProjectResponse res = new ProjectResponse();
        res.setId(project.getId());
        res.setTitle(project.getTitle());
        res.setTagLine(project.getTagLine());
        res.setDescription(project.getDescription());
        boolean isOwnerFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(project.getOwner());
        res.setOwner(UserSummaryDto.fromUser(project.getOwner(), isOwnerFollowed));
        res.setStatus(project.getStatus());
        res.setMaxMembers(project.getMaxMembers());
        res.setRepositoryUrl(project.getRepositoryUrl());
        res.setLiveDemoUrl(project.getLiveDemoUrl());
        res.setRequiredSkills(project.getRequiredSkills());
        res.setTechStack(project.getTechStack());

        int count = 1; // Owner is always counted
        if (project.getMembers() != null) {
            count += project.getMembers().size();
            res.setMembers(project.getMembers().stream()
                    .map(m -> {
                        boolean followed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(m);
                        return UserSummaryDto.fromUser(m, followed);
                    })
                    .collect(Collectors.toList()));
        }
        res.setCurrentMembersCount(count);

        if (currentUser != null) {
            res.setOwner(currentUser.getId().equals(project.getOwner().getId()));
            boolean isMem = project.getMembers() != null && project.getMembers().contains(currentUser);
            res.setMember(res.isOwner() || isMem);
        }

        res.setCreatedAt(project.getCreatedAt());
        res.setUpdatedAt(project.getUpdatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTagLine() {
        return tagLine;
    }

    public void setTagLine(String tagLine) {
        this.tagLine = tagLine;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UserSummaryDto getOwner() {
        return owner;
    }

    public void setOwner(UserSummaryDto owner) {
        this.owner = owner;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public int getMaxMembers() {
        return maxMembers;
    }

    public void setMaxMembers(int maxMembers) {
        this.maxMembers = maxMembers;
    }

    public int getCurrentMembersCount() {
        return currentMembersCount;
    }

    public void setCurrentMembersCount(int currentMembersCount) {
        this.currentMembersCount = currentMembersCount;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.repositoryUrl = repositoryUrl;
    }

    public String getLiveDemoUrl() {
        return liveDemoUrl;
    }

    public void setLiveDemoUrl(String liveDemoUrl) {
        this.liveDemoUrl = liveDemoUrl;
    }

    public Set<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(Set<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public Set<String> getTechStack() {
        return techStack;
    }

    public void setTechStack(Set<String> techStack) {
        this.techStack = techStack;
    }

    public List<UserSummaryDto> getMembers() {
        return members;
    }

    public void setMembers(List<UserSummaryDto> members) {
        this.members = members;
    }

    public boolean isOwner() {
        return isOwner;
    }

    public void setOwner(boolean owner) {
        isOwner = owner;
    }

    public boolean isMember() {
        return isMember;
    }

    public void setMember(boolean member) {
        isMember = member;
    }

    public boolean isHasApplied() {
        return hasApplied;
    }

    public void setHasApplied(boolean hasApplied) {
        this.hasApplied = hasApplied;
    }

    public String getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(String applicationStatus) {
        this.applicationStatus = applicationStatus;
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
