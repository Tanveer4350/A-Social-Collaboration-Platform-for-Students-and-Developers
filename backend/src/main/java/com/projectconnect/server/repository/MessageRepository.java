package com.projectconnect.server.repository;

import com.projectconnect.server.model.Message;
import com.projectconnect.server.model.Project;
import com.projectconnect.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.sender = :u1 AND m.recipient = :u2) " +
           "OR (m.sender = :u2 AND m.recipient = :u1) ORDER BY m.createdAt ASC")
    List<Message> findDirectConversation(@Param("u1") User u1, @Param("u2") User u2);

    List<Message> findByProjectOrderByCreatedAtAsc(Project project);

    @Query("SELECT m FROM Message m WHERE (m.sender = :user OR m.recipient = :user) AND m.project IS NULL ORDER BY m.createdAt DESC")
    List<Message> findAllDirectMessagesForUser(@Param("user") User user);

    long countByRecipientAndIsReadFalse(User recipient);
}
