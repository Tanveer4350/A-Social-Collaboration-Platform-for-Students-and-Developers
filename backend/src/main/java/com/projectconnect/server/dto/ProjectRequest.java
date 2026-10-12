package com.projectconnect.server.dto;

import com.projectconnect.server.model.ProjectStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

public class ProjectRequest {
    @NotBlank
    private String title;

    private String tagLine;

    @NotBlank
    private String description;

    @Min(1)
    private int maxMembers = 5;

    private String repositoryUrl;
    private String liveDemoUrl;
    private ProjectStatus status = ProjectStatus.OPEN;
    private Set<String> requiredSkills;
    private Set<String> techStack;

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

    public int getMaxMembers() {
        return maxMembers;
    }

    public void setMaxMembers(int maxMembers) {
        this.maxMembers = maxMembers;
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

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
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
}
