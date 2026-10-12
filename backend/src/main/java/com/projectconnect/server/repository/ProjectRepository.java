package com.projectconnect.server.repository;

import com.projectconnect.server.model.Project;
import com.projectconnect.server.model.ProjectStatus;
import com.projectconnect.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOrderByCreatedAtDesc();

    List<Project> findByOwnerOrderByCreatedAtDesc(User owner);

    List<Project> findByStatusOrderByCreatedAtDesc(ProjectStatus status);

    @Query("SELECT p FROM Project p WHERE :user MEMBER OF p.members ORDER BY p.createdAt DESC")
    List<Project> findByMember(@Param("user") User user);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.requiredSkills s WHERE LOWER(s) = LOWER(:skill) ORDER BY p.createdAt DESC")
    List<Project> findByRequiredSkill(@Param("skill") String skill);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.techStack t WHERE LOWER(t) = LOWER(:tech) ORDER BY p.createdAt DESC")
    List<Project> findByTechStack(@Param("tech") String tech);

    @Query("SELECT p FROM Project p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.tagLine) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY p.createdAt DESC")
    List<Project> searchProjects(@Param("query") String query);
}
