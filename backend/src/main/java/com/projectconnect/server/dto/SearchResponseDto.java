package com.projectconnect.server.dto;

import java.util.List;

public class SearchResponseDto {
    private List<UserSummaryDto> users;
    private List<ProjectResponse> projects;
    private List<PostResponse> posts;

    public SearchResponseDto() {}

    public SearchResponseDto(List<UserSummaryDto> users, List<ProjectResponse> projects, List<PostResponse> posts) {
        this.users = users;
        this.projects = projects;
        this.posts = posts;
    }

    public List<UserSummaryDto> getUsers() {
        return users;
    }

    public void setUsers(List<UserSummaryDto> users) {
        this.users = users;
    }

    public List<ProjectResponse> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectResponse> projects) {
        this.projects = projects;
    }

    public List<PostResponse> getPosts() {
        return posts;
    }

    public void setPosts(List<PostResponse> posts) {
        this.posts = posts;
    }
}
