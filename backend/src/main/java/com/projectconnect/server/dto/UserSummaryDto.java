package com.projectconnect.server.dto;

import com.projectconnect.server.model.Role;
import com.projectconnect.server.model.User;
import java.util.Set;

public class UserSummaryDto {
    private Long id;
    private String username;
    private String fullName;
    private String headline;
    private String avatarUrl;
    private Role role;
    private Set<String> skills;
    private boolean isFollowedByCurrentUser;

    public UserSummaryDto() {}

    public static UserSummaryDto fromUser(User user, boolean isFollowed) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setHeadline(user.getHeadline());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setRole(user.getRole());
        dto.setSkills(user.getSkills());
        dto.setFollowedByCurrentUser(isFollowed);
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Set<String> getSkills() {
        return skills;
    }

    public void setSkills(Set<String> skills) {
        this.skills = skills;
    }

    public boolean isFollowedByCurrentUser() {
        return isFollowedByCurrentUser;
    }

    public void setFollowedByCurrentUser(boolean followedByCurrentUser) {
        isFollowedByCurrentUser = followedByCurrentUser;
    }
}
