package com.projectconnect.server.service;

import com.projectconnect.server.dto.ApplicationRequest;
import com.projectconnect.server.dto.ApplicationResponse;
import com.projectconnect.server.dto.ProjectRequest;
import com.projectconnect.server.dto.ProjectResponse;
import com.projectconnect.server.model.*;
import com.projectconnect.server.repository.ProjectApplicationRepository;
import com.projectconnect.server.repository.ProjectRepository;
import com.projectconnect.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        User currentUser = userService.getCurrentUser();
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setTagLine(request.getTagLine());
        project.setDescription(request.getDescription());
        project.setOwner(currentUser);
        project.setMaxMembers(request.getMaxMembers());
        project.setStatus(request.getStatus() != null ? request.getStatus() : ProjectStatus.OPEN);
        project.setRepositoryUrl(request.getRepositoryUrl());
        project.setLiveDemoUrl(request.getLiveDemoUrl());
        project.setRequiredSkills(request.getRequiredSkills());
        project.setTechStack(request.getTechStack());

        Project saved = projectRepository.save(project);
        return ProjectResponse.fromProject(saved, currentUser);
    }

    public List<ProjectResponse> getAllProjects(ProjectStatus status, String tech) {
        User currentUser = userService.getCurrentUserOrNull();
        List<Project> projects;

        if (status != null) {
            projects = projectRepository.findByStatusOrderByCreatedAtDesc(status);
        } else if (tech != null && !tech.trim().isEmpty()) {
            projects = projectRepository.findByTechStack(tech.trim());
        } else {
            projects = projectRepository.findAllByOrderByCreatedAtDesc();
        }

        return projects.stream()
                .map(p -> mapWithApplicationStatus(p, currentUser))
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long id) {
        User currentUser = userService.getCurrentUserOrNull();
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
        return mapWithApplicationStatus(project, currentUser);
    }

    private ProjectResponse mapWithApplicationStatus(Project project, User currentUser) {
        ProjectResponse response = ProjectResponse.fromProject(project, currentUser);
        if (currentUser != null) {
            Optional<ProjectApplication> app = applicationRepository.findByProjectAndApplicant(project, currentUser);
            if (app.isPresent()) {
                response.setHasApplied(true);
                response.setApplicationStatus(app.get().getStatus().name());
            }
        }
        return response;
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: Only the project owner can update details");
        }

        if (request.getTitle() != null) project.setTitle(request.getTitle());
        if (request.getTagLine() != null) project.setTagLine(request.getTagLine());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getMaxMembers() > 0) project.setMaxMembers(request.getMaxMembers());
        if (request.getStatus() != null) project.setStatus(request.getStatus());
        if (request.getRepositoryUrl() != null) project.setRepositoryUrl(request.getRepositoryUrl());
        if (request.getLiveDemoUrl() != null) project.setLiveDemoUrl(request.getLiveDemoUrl());
        if (request.getRequiredSkills() != null) project.setRequiredSkills(request.getRequiredSkills());
        if (request.getTechStack() != null) project.setTechStack(request.getTechStack());

        Project saved = projectRepository.save(project);
        return ProjectResponse.fromProject(saved, currentUser);
    }

    @Transactional
    public void deleteProject(Long id) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: Only the project owner can delete this project");
        }

        projectRepository.delete(project);
    }

    @Transactional
    public ApplicationResponse applyToProject(Long projectId, ApplicationRequest request) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (project.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are the owner of this project");
        }

        if (project.getMembers().contains(currentUser)) {
            throw new RuntimeException("You are already a member of this project");
        }

        Optional<ProjectApplication> existing = applicationRepository.findByProjectAndApplicant(project, currentUser);
        if (existing.isPresent()) {
            throw new RuntimeException("You have already applied to this project (Status: " + existing.get().getStatus() + ")");
        }

        ProjectApplication application = new ProjectApplication(project, currentUser, request != null ? request.getMessage() : "");
        ProjectApplication saved = applicationRepository.save(application);

        // Notify Project Owner
        notificationService.createNotification(
                project.getOwner(),
                currentUser,
                NotificationType.APPLICATION_RECEIVED,
                currentUser.getFullName() + " applied to join your project \"" + project.getTitle() + "\"",
                "/projects/" + project.getId()
        );

        return ApplicationResponse.fromApplication(saved, currentUser);
    }

    public List<ApplicationResponse> getProjectApplications(Long projectId) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: Only the project owner can view applications");
        }

        return applicationRepository.findByProjectOrderByCreatedAtDesc(project).stream()
                .map(a -> ApplicationResponse.fromApplication(a, currentUser))
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getMyApplications() {
        User currentUser = userService.getCurrentUser();
        return applicationRepository.findByApplicantOrderByCreatedAtDesc(currentUser).stream()
                .map(a -> ApplicationResponse.fromApplication(a, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse respondToApplication(Long applicationId, ApplicationStatus status) {
        User currentUser = userService.getCurrentUser();
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Project project = application.getProject();
        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: Only project owner can accept/reject applications");
        }

        application.setStatus(status);
        ProjectApplication saved = applicationRepository.save(application);

        if (status == ApplicationStatus.ACCEPTED) {
            project.getMembers().add(application.getApplicant());
            projectRepository.save(project);

            notificationService.createNotification(
                    application.getApplicant(),
                    currentUser,
                    NotificationType.APPLICATION_ACCEPTED,
                    "Congratulations! Your application to join \"" + project.getTitle() + "\" was accepted!",
                    "/projects/" + project.getId()
            );
        } else if (status == ApplicationStatus.REJECTED) {
            notificationService.createNotification(
                    application.getApplicant(),
                    currentUser,
                    NotificationType.APPLICATION_REJECTED,
                    "Your application to join \"" + project.getTitle() + "\" was not accepted at this time.",
                    "/projects/" + project.getId()
            );
        }

        return ApplicationResponse.fromApplication(saved, currentUser);
    }

    public List<ProjectResponse> getUserProjects(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        User currentUser = userService.getCurrentUserOrNull();
        return projectRepository.findByOwnerOrderByCreatedAtDesc(user).stream()
                .map(p -> mapWithApplicationStatus(p, currentUser))
                .collect(Collectors.toList());
    }

    public List<ProjectResponse> getUserJoinedProjects(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        User currentUser = userService.getCurrentUserOrNull();
        return projectRepository.findByMember(user).stream()
                .map(p -> mapWithApplicationStatus(p, currentUser))
                .collect(Collectors.toList());
    }
}
