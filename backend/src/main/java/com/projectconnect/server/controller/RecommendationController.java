package com.projectconnect.server.controller;

import com.projectconnect.server.dto.RecommendationDto;
import com.projectconnect.server.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<RecommendationDto> getRecommendations() {
        return ResponseEntity.ok(recommendationService.getRecommendationsForCurrentUser());
    }
}
