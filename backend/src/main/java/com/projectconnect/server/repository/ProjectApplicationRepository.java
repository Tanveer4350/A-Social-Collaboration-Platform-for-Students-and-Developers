package com.projectconnect.server.repository;

import com.projectconnect.server.model.ApplicationStatus;
import com.projectconnect.server.model.Project;
import com.projectconnect.server.model.ProjectApplication;
import com.projectconnect.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {
    List<ProjectApplication> findByProjectOrderByCreatedAtDesc(Project project);
    List<ProjectApplication> findByApplicantOrderByCreatedAtDesc(User applicant);
    Optional<ProjectApplication> findByProjectAndApplicant(Project project, User applicant);
    List<ProjectApplication> findByProjectAndStatus(Project project, ApplicationStatus status);
}
