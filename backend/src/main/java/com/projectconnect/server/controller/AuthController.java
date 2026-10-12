package com.projectconnect.server.controller;

import com.projectconnect.server.dto.*;
import com.projectconnect.server.model.Role;
import com.projectconnect.server.model.User;
import com.projectconnect.server.repository.UserRepository;
import com.projectconnect.server.security.JwtUtils;
import com.projectconnect.server.security.UserPrincipal;
import com.projectconnect.server.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsernameOrEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getHeadline(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getSkills()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error: Email is already in use!"));
        }

        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFullName(),
                signUpRequest.getRole() != null ? signUpRequest.getRole() : Role.ROLE_STUDENT
        );

        if (signUpRequest.getHeadline() != null) user.setHeadline(signUpRequest.getHeadline());
        if (signUpRequest.getBio() != null) user.setBio(signUpRequest.getBio());
        if (signUpRequest.getEducation() != null) user.setEducation(signUpRequest.getEducation());
        if (signUpRequest.getSkills() != null) user.setSkills(signUpRequest.getSkills());
        if (signUpRequest.getInterests() != null) user.setInterests(signUpRequest.getInterests());

        User saved = userRepository.save(user);

        String jwt = jwtUtils.generateTokenFromUsername(saved.getUsername());

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getFullName(),
                saved.getHeadline(),
                saved.getAvatarUrl(),
                saved.getRole(),
                saved.getSkills()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(UserProfileDto.fromUser(currentUser, false, true));
    }
}
