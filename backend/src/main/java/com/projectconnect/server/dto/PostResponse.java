package com.projectconnect.server.dto;

import com.projectconnect.server.model.Post;
import com.projectconnect.server.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class PostResponse {
    private Long id;
    private UserSummaryDto author;
    private String content;
    private String codeSnippet;
    private String language;
    private String mediaUrl;
    private Set<String> tags;
    private int likesCount;
    private int commentsCount;
    private boolean isLikedByCurrentUser;
    private boolean isOwner;
    private List<CommentResponse> recentComments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PostResponse() {}

    public static PostResponse fromPost(Post post, User currentUser) {
        PostResponse res = new PostResponse();
        res.setId(post.getId());
        boolean isAuthorFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(post.getAuthor());
        res.setAuthor(UserSummaryDto.fromUser(post.getAuthor(), isAuthorFollowed));
        res.setContent(post.getContent());
        res.setCodeSnippet(post.getCodeSnippet());
        res.setLanguage(post.getLanguage());
        res.setMediaUrl(post.getMediaUrl());
        res.setTags(post.getTags());
        res.setLikesCount(post.getLikes() != null ? post.getLikes().size() : 0);
        res.setCommentsCount(post.getComments() != null ? post.getComments().size() : 0);
        res.setLikedByCurrentUser(currentUser != null && post.getLikes() != null && post.getLikes().contains(currentUser));
        res.setOwner(currentUser != null && currentUser.getId().equals(post.getAuthor().getId()));
        res.setCreatedAt(post.getCreatedAt());
        res.setUpdatedAt(post.getUpdatedAt());

        if (post.getComments() != null) {
            res.setRecentComments(post.getComments().stream()
                    .map(c -> CommentResponse.fromComment(c, currentUser))
                    .collect(Collectors.toList()));
        }

        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserSummaryDto getAuthor() {
        return author;
    }

    public void setAuthor(UserSummaryDto author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCodeSnippet() {
        return codeSnippet;
    }

    public void setCodeSnippet(String codeSnippet) {
        this.codeSnippet = codeSnippet;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }

    public int getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(int likesCount) {
        this.likesCount = likesCount;
    }

    public int getCommentsCount() {
        return commentsCount;
    }

    public void setCommentsCount(int commentsCount) {
        this.commentsCount = commentsCount;
    }

    public boolean isLikedByCurrentUser() {
        return isLikedByCurrentUser;
    }

    public void setLikedByCurrentUser(boolean likedByCurrentUser) {
        isLikedByCurrentUser = likedByCurrentUser;
    }

    public boolean isOwner() {
        return isOwner;
    }

    public void setOwner(boolean owner) {
        isOwner = owner;
    }

    public List<CommentResponse> getRecentComments() {
        return recentComments;
    }

    public void setRecentComments(List<CommentResponse> recentComments) {
        this.recentComments = recentComments;
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
