package com.projectconnect.server.service;

import com.projectconnect.server.dto.ProjectResponse;
import com.projectconnect.server.dto.RecommendationDto;
import com.projectconnect.server.dto.RecommendationDto.CollaboratorMatchDto;
import com.projectconnect.server.dto.RecommendationDto.ProjectMatchDto;
import com.projectconnect.server.dto.UserSummaryDto;
import com.projectconnect.server.model.Project;
import com.projectconnect.server.model.ProjectStatus;
import com.projectconnect.server.model.User;
import com.projectconnect.server.repository.ProjectRepository;
import com.projectconnect.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    public RecommendationDto getRecommendationsForCurrentUser() {
        User currentUser = userService.getCurrentUserOrNull();

        List<ProjectMatchDto> recommendedProjects = new ArrayList<>();
        List<CollaboratorMatchDto> recommendedCollaborators = new ArrayList<>();

        Set<String> mySkills = currentUser != null && currentUser.getSkills() != null
                ? currentUser.getSkills().stream().map(String::toLowerCase).collect(Collectors.toSet())
                : Collections.emptySet();

        Set<String> myInterests = currentUser != null && currentUser.getInterests() != null
                ? currentUser.getInterests().stream().map(String::toLowerCase).collect(Collectors.toSet())
                : Collections.emptySet();

        // 1. Recommend Projects
        List<Project> openProjects = projectRepository.findByStatusOrderByCreatedAtDesc(ProjectStatus.OPEN);
        for (Project project : openProjects) {
            if (currentUser != null && project.getOwner().getId().equals(currentUser.getId())) {
                continue; // Don't recommend own project
            }

            Set<String> reqSkills = project.getRequiredSkills() != null ? project.getRequiredSkills() : Collections.emptySet();
            Set<String> techStack = project.getTechStack() != null ? project.getTechStack() : Collections.emptySet();

            Set<String> allProjectTags = new HashSet<>();
            reqSkills.forEach(s -> allProjectTags.add(s.toLowerCase()));
            techStack.forEach(t -> allProjectTags.add(t.toLowerCase()));

            Set<String> matched = new HashSet<>();
            for (String s : mySkills) {
                if (allProjectTags.contains(s)) {
                    matched.add(s);
                }
            }

            int score;
            if (allProjectTags.isEmpty()) {
                score = 50; // default baseline
            } else {
                score = Math.min(100, Math.max(30, (int) Math.round(((double) matched.size() / Math.max(1, reqSkills.size())) * 100)));
            }

            // Capitalize matched for display
            Set<String> displayMatched = new HashSet<>();
            for (String req : reqSkills) {
                if (mySkills.contains(req.toLowerCase())) {
                    displayMatched.add(req);
                }
            }

            ProjectResponse pResp = ProjectResponse.fromProject(project, currentUser);
            recommendedProjects.add(new ProjectMatchDto(pResp, score, displayMatched));
        }

        // Sort projects by score DESC
        recommendedProjects.sort((p1, p2) -> Integer.compare(p2.getMatchScorePercentage(), p1.getMatchScorePercentage()));

        // 2. Recommend Collaborators / Students
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            if (currentUser != null && user.getId().equals(currentUser.getId())) {
                continue;
            }

            Set<String> theirSkills = user.getSkills() != null
                    ? user.getSkills().stream().map(String::toLowerCase).collect(Collectors.toSet())
                    : Collections.emptySet();
            Set<String> theirInterests = user.getInterests() != null
                    ? user.getInterests().stream().map(String::toLowerCase).collect(Collectors.toSet())
                    : Collections.emptySet();

            Set<String> commonSkills = new HashSet<>();
            for (String skill : mySkills) {
                if (theirSkills.contains(skill)) {
                    commonSkills.add(skill);
                }
            }

            Set<String> complementarySkills = new HashSet<>();
            for (String skill : theirSkills) {
                if (!mySkills.contains(skill)) {
                    complementarySkills.add(skill);
                }
            }

            Set<String> commonInterests = new HashSet<>();
            for (String interest : myInterests) {
                if (theirInterests.contains(interest)) {
                    commonInterests.add(interest);
                }
            }

            int matchScore = 40; // Base score
            matchScore += (commonSkills.size() * 15);
            matchScore += (commonInterests.size() * 10);
            matchScore += (Math.min(complementarySkills.size(), 3) * 5);
            matchScore = Math.min(98, Math.max(35, matchScore));

            boolean isFollowed = currentUser != null && currentUser.getFollowing() != null && currentUser.getFollowing().contains(user);
            UserSummaryDto uSummary = UserSummaryDto.fromUser(user, isFollowed);

            recommendedCollaborators.add(new CollaboratorMatchDto(uSummary, matchScore, commonSkills, complementarySkills));
        }

        recommendedCollaborators.sort((c1, c2) -> Integer.compare(c2.getMatchScorePercentage(), c1.getMatchScorePercentage()));

        return new RecommendationDto(
                recommendedProjects.stream().limit(8).collect(Collectors.toList()),
                recommendedCollaborators.stream().limit(8).collect(Collectors.toList())
        );
    }
}
