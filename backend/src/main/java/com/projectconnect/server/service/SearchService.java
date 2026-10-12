package com.projectconnect.server.service;

import com.projectconnect.server.dto.PostResponse;
import com.projectconnect.server.dto.ProjectResponse;
import com.projectconnect.server.dto.SearchResponseDto;
import com.projectconnect.server.dto.UserSummaryDto;
import com.projectconnect.server.model.User;
import com.projectconnect.server.repository.PostRepository;
import com.projectconnect.server.repository.ProjectRepository;
import com.projectconnect.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    public SearchResponseDto search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new SearchResponseDto(List.of(), List.of(), List.of());
        }

        String q = query.trim();
        User currentUser = userService.getCurrentUserOrNull();

        List<UserSummaryDto> users = userRepository.searchUsers(q).stream()
                .map(u -> {
                    boolean isFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(u);
                    return UserSummaryDto.fromUser(u, isFollowed);
                })
                .limit(10)
                .collect(Collectors.toList());

        List<ProjectResponse> projects = projectRepository.searchProjects(q).stream()
                .map(p -> ProjectResponse.fromProject(p, currentUser))
                .limit(10)
                .collect(Collectors.toList());

        List<PostResponse> posts = postRepository.searchPosts(q).stream()
                .map(p -> PostResponse.fromPost(p, currentUser))
                .limit(10)
                .collect(Collectors.toList());

        return new SearchResponseDto(users, projects, posts);
    }
}
