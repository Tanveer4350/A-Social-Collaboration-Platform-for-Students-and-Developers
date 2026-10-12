package com.projectconnect.server.dto;

import com.projectconnect.server.model.Role;
import com.projectconnect.server.model.User;
import java.time.LocalDateTime;
import java.util.Set;

public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String headline;
    private String bio;
    private String education;
    private String avatarUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private Role role;
    private Set<String> skills;
    private Set<String> interests;
    private int followersCount;
    private int followingCount;
    private boolean isFollowedByCurrentUser;
    private boolean isSelf;
    private LocalDateTime createdAt;

    public UserProfileDto() {}

    public static UserProfileDto fromUser(User user, boolean isFollowed, boolean isSelf) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setHeadline(user.getHeadline());
        dto.setBio(user.getBio());
        dto.setEducation(user.getEducation());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setGithubUrl(user.getGithubUrl());
        dto.setLinkedinUrl(user.getLinkedinUrl());
        dto.setPortfolioUrl(user.getPortfolioUrl());
        dto.setRole(user.getRole());
        dto.setSkills(user.getSkills());
        dto.setInterests(user.getInterests());
        dto.setFollowersCount(user.getFollowers() != null ? user.getFollowers().size() : 0);
        dto.setFollowingCount(user.getFollowing() != null ? user.getFollowing().size() : 0);
        dto.setFollowedByCurrentUser(isFollowed);
        dto.setSelf(isSelf);
        dto.setCreatedAt(user.getCreatedAt());
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
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

    public Set<String> getInterests() {
        return interests;
    }

    public void setInterests(Set<String> interests) {
        this.interests = interests;
    }

    public int getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(int followersCount) {
        this.followersCount = followersCount;
    }

    public int getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(int followingCount) {
        this.followingCount = followingCount;
    }

    public boolean isFollowedByCurrentUser() {
        return isFollowedByCurrentUser;
    }

    public void setFollowedByCurrentUser(boolean followedByCurrentUser) {
        isFollowedByCurrentUser = followedByCurrentUser;
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
