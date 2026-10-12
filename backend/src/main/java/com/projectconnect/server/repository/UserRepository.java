package com.projectconnect.server.repository;

import com.projectconnect.server.model.Role;
import com.projectconnect.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.headline) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.bio) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchUsers(@Param("query") String query);

    @Query("SELECT DISTINCT u FROM User u JOIN u.skills s WHERE LOWER(s) = LOWER(:skill)")
    List<User> findBySkill(@Param("skill") String skill);

    List<User> findByRole(Role role);
}
