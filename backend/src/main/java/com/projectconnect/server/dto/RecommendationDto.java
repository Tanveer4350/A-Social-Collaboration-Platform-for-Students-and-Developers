package com.projectconnect.server.dto;

import java.util.List;
import java.util.Set;

public class RecommendationDto {
    private List<ProjectMatchDto> recommendedProjects;
    private List<CollaboratorMatchDto> recommendedCollaborators;

    public RecommendationDto() {}

    public RecommendationDto(List<ProjectMatchDto> recommendedProjects, List<CollaboratorMatchDto> recommendedCollaborators) {
        this.recommendedProjects = recommendedProjects;
        this.recommendedCollaborators = recommendedCollaborators;
    }

    public List<ProjectMatchDto> getRecommendedProjects() {
        return recommendedProjects;
    }

    public void setRecommendedProjects(List<ProjectMatchDto> recommendedProjects) {
        this.recommendedProjects = recommendedProjects;
    }

    public List<CollaboratorMatchDto> getRecommendedCollaborators() {
        return recommendedCollaborators;
    }

    public void setRecommendedCollaborators(List<CollaboratorMatchDto> recommendedCollaborators) {
        this.recommendedCollaborators = recommendedCollaborators;
    }

    public static class ProjectMatchDto {
        private ProjectResponse project;
        private int matchScorePercentage;
        private Set<String> matchingSkills;

        public ProjectMatchDto() {}

        public ProjectMatchDto(ProjectResponse project, int matchScorePercentage, Set<String> matchingSkills) {
            this.project = project;
            this.matchScorePercentage = matchScorePercentage;
            this.matchingSkills = matchingSkills;
        }

        public ProjectResponse getProject() {
            return project;
        }

        public void setProject(ProjectResponse project) {
            this.project = project;
        }

        public int getMatchScorePercentage() {
            return matchScorePercentage;
        }

        public void setMatchScorePercentage(int matchScorePercentage) {
            this.matchScorePercentage = matchScorePercentage;
        }

        public Set<String> getMatchingSkills() {
            return matchingSkills;
        }

        public void setMatchingSkills(Set<String> matchingSkills) {
            this.matchingSkills = matchingSkills;
        }
    }

    public static class CollaboratorMatchDto {
        private UserSummaryDto user;
        private int matchScorePercentage;
        private Set<String> commonSkills;
        private Set<String> complementarySkills;

        public CollaboratorMatchDto() {}

        public CollaboratorMatchDto(UserSummaryDto user, int matchScorePercentage, Set<String> commonSkills, Set<String> complementarySkills) {
            this.user = user;
            this.matchScorePercentage = matchScorePercentage;
            this.commonSkills = commonSkills;
            this.complementarySkills = complementarySkills;
        }

        public UserSummaryDto getUser() {
            return user;
        }

        public void setUser(UserSummaryDto user) {
            this.user = user;
        }

        public int getMatchScorePercentage() {
            return matchScorePercentage;
        }

        public void setMatchScorePercentage(int matchScorePercentage) {
            this.matchScorePercentage = matchScorePercentage;
        }

        public Set<String> getCommonSkills() {
            return commonSkills;
        }

        public void setCommonSkills(Set<String> commonSkills) {
            this.commonSkills = commonSkills;
        }

        public Set<String> getComplementarySkills() {
            return complementarySkills;
        }

        public void setComplementarySkills(Set<String> complementarySkills) {
            this.complementarySkills = complementarySkills;
        }
    }
}
