package com.projectconnect.server.repository;

import com.projectconnect.server.model.Post;
import com.projectconnect.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByAuthorOrderByCreatedAtDesc(User author);

    @Query("SELECT p FROM Post p WHERE p.author IN :authors ORDER BY p.createdAt DESC")
    List<Post> findFeedByAuthors(@Param("authors") List<User> authors);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.tags t WHERE LOWER(t) = LOWER(:tag) ORDER BY p.createdAt DESC")
    List<Post> findByTag(@Param("tag") String tag);

    @Query("SELECT p FROM Post p WHERE LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.codeSnippet) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY p.createdAt DESC")
    List<Post> searchPosts(@Param("query") String query);
}
