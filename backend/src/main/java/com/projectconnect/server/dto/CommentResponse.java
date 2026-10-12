package com.projectconnect.server.dto;

import com.projectconnect.server.model.PostComment;
import com.projectconnect.server.model.User;

import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private Long postId;
    private UserSummaryDto author;
    private String content;
    private boolean isOwner;
    private LocalDateTime createdAt;

    public CommentResponse() {}

    public static CommentResponse fromComment(PostComment comment, User currentUser) {
        CommentResponse res = new CommentResponse();
        res.setId(comment.getId());
        res.setPostId(comment.getPost().getId());
        boolean isFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(comment.getAuthor());
        res.setAuthor(UserSummaryDto.fromUser(comment.getAuthor(), isFollowed));
        res.setContent(comment.getContent());
        res.setOwner(currentUser != null && currentUser.getId().equals(comment.getAuthor().getId()));
        res.setCreatedAt(comment.getCreatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
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

    public boolean isOwner() {
        return isOwner;
    }

    public void setOwner(boolean owner) {
        isOwner = owner;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
