package com.projectconnect.server.service;

import com.projectconnect.server.dto.UpdateProfileRequest;
import com.projectconnect.server.dto.UserProfileDto;
import com.projectconnect.server.dto.UserSummaryDto;
import com.projectconnect.server.model.NotificationType;
import com.projectconnect.server.model.User;
import com.projectconnect.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public User getCurrentUserOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return userRepository.findByUsername(auth.getName()).orElse(null);
    }

    public User getCurrentUser() {
        User user = getCurrentUserOrNull();
        if (user == null) {
            throw new RuntimeException("Unauthorized: No authenticated user session");
        }
        return user;
    }

    public UserProfileDto getProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        User currentUser = getCurrentUserOrNull();
        boolean isFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(user);
        boolean isSelf = currentUser != null && currentUser.getId().equals(user.getId());
        return UserProfileDto.fromUser(user, isFollowed, isSelf);
    }

    public UserProfileDto getProfileById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        User currentUser = getCurrentUserOrNull();
        boolean isFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(user);
        boolean isSelf = currentUser != null && currentUser.getId().equals(user.getId());
        return UserProfileDto.fromUser(user, isFollowed, isSelf);
    }

    @Transactional
    public UserProfileDto updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getHeadline() != null) user.setHeadline(request.getHeadline());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getEducation() != null) user.setEducation(request.getEducation());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getGithubUrl() != null) user.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null) user.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getPortfolioUrl() != null) user.setPortfolioUrl(request.getPortfolioUrl());
        if (request.getRole() != null) user.setRole(request.getRole());
        if (request.getSkills() != null) user.setSkills(request.getSkills());
        if (request.getInterests() != null) user.setInterests(request.getInterests());

        User saved = userRepository.save(user);
        return UserProfileDto.fromUser(saved, false, true);
    }

    @Transactional
    public boolean toggleFollowUser(Long targetUserId) {
        User currentUser = getCurrentUser();
        if (currentUser.getId().equals(targetUserId)) {
            throw new RuntimeException("You cannot follow yourself");
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        boolean nowFollowing;
        if (currentUser.getFollowing().contains(targetUser)) {
            currentUser.getFollowing().remove(targetUser);
            targetUser.getFollowers().remove(currentUser);
            nowFollowing = false;
        } else {
            currentUser.getFollowing().add(targetUser);
            targetUser.getFollowers().add(currentUser);
            nowFollowing = true;

            // Trigger notification
            notificationService.createNotification(
                    targetUser,
                    currentUser,
                    NotificationType.FOLLOW,
                    currentUser.getFullName() + " started following you.",
                    "/profile/" + currentUser.getUsername()
            );
        }

        userRepository.save(currentUser);
        userRepository.save(targetUser);
        return nowFollowing;
    }

    public List<UserSummaryDto> getAllUsers() {
        User currentUser = getCurrentUserOrNull();
        return userRepository.findAll().stream()
                .filter(u -> currentUser == null || !u.getId().equals(currentUser.getId()))
                .map(u -> {
                    boolean isFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(u);
                    return UserSummaryDto.fromUser(u, isFollowed);
                })
                .collect(Collectors.toList());
    }

    public List<UserSummaryDto> getFollowers(Long userId) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User currentUser = getCurrentUserOrNull();
        return targetUser.getFollowers().stream()
                .map(u -> {
                    boolean isFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(u);
                    return UserSummaryDto.fromUser(u, isFollowed);
                })
                .collect(Collectors.toList());
    }

    public List<UserSummaryDto> getFollowing(Long userId) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User currentUser = getCurrentUserOrNull();
        return targetUser.getFollowing().stream()
                .map(u -> {
                    boolean isFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(u);
                    return UserSummaryDto.fromUser(u, isFollowed);
                })
                .collect(Collectors.toList());
    }

    public List<UserSummaryDto> getUsersBySkill(String skill) {
        User currentUser = getCurrentUserOrNull();
        return userRepository.findBySkill(skill).stream()
                .map(u -> {
                    boolean isFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(u);
                    return UserSummaryDto.fromUser(u, isFollowed);
                })
                .collect(Collectors.toList());
    }
}
