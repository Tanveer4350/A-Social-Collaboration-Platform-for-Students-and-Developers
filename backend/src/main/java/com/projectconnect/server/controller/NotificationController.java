package com.projectconnect.server.controller;

import com.projectconnect.server.dto.ApiResponse;
import com.projectconnect.server.dto.NotificationResponse;
import com.projectconnect.server.model.User;
import com.projectconnect.server.service.NotificationService;
import com.projectconnect.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(notificationService.getUserNotifications(currentUser));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(Map.of("unreadCount", notificationService.getUnreadCount(currentUser)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        notificationService.markAsRead(id, currentUser);
        return ResponseEntity.ok(new ApiResponse(true, "Marked as read"));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        User currentUser = userService.getCurrentUser();
        notificationService.markAllAsRead(currentUser);
        return ResponseEntity.ok(new ApiResponse(true, "All marked as read"));
    }
}
