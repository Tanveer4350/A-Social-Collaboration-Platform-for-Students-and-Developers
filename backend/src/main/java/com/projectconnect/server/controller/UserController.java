package com.projectconnect.server.controller;

import com.projectconnect.server.dto.ApiResponse;
import com.projectconnect.server.dto.UpdateProfileRequest;
import com.projectconnect.server.dto.UserProfileDto;
import com.projectconnect.server.dto.UserSummaryDto;
import com.projectconnect.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserSummaryDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<UserProfileDto> getProfileByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getProfileByUsername(username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDto> getProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getProfileById(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<?> toggleFollow(@PathVariable Long id) {
        boolean following = userService.toggleFollowUser(id);
        return ResponseEntity.ok(Map.of(
                "following", following,
                "message", following ? "Successfully followed user" : "Successfully unfollowed user"
        ));
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<List<UserSummaryDto>> getFollowers(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getFollowers(id));
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<List<UserSummaryDto>> getFollowing(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getFollowing(id));
    }

    @GetMapping("/skill/{skill}")
    public ResponseEntity<List<UserSummaryDto>> getUsersBySkill(@PathVariable String skill) {
        return ResponseEntity.ok(userService.getUsersBySkill(skill));
    }
}
