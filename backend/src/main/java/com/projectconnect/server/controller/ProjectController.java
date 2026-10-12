package com.projectconnect.server.controller;

import com.projectconnect.server.dto.*;
import com.projectconnect.server.model.ApplicationStatus;
import com.projectconnect.server.model.ProjectStatus;
import com.projectconnect.server.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects(
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) String tech) {
        return ResponseEntity.ok(projectService.getAllProjects(status, tech));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(new ApiResponse(true, "Project deleted successfully"));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<ApplicationResponse> applyToProject(@PathVariable Long id, @RequestBody(required = false) ApplicationRequest request) {
        return ResponseEntity.ok(projectService.applyToProject(id, request));
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<List<ApplicationResponse>> getProjectApplications(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectApplications(id));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications() {
        return ResponseEntity.ok(projectService.getMyApplications());
    }

    @PostMapping("/applications/{applicationId}/respond")
    public ResponseEntity<ApplicationResponse> respondToApplication(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        ApplicationStatus status = ApplicationStatus.valueOf(statusStr.toUpperCase());
        return ResponseEntity.ok(projectService.respondToApplication(applicationId, status));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<ProjectResponse>> getUserProjects(@PathVariable String username) {
        return ResponseEntity.ok(projectService.getUserProjects(username));
    }

    @GetMapping("/user/{username}/joined")
    public ResponseEntity<List<ProjectResponse>> getUserJoinedProjects(@PathVariable String username) {
        return ResponseEntity.ok(projectService.getUserJoinedProjects(username));
    }
}
