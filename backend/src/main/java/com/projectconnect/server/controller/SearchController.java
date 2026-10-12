package com.projectconnect.server.controller;

import com.projectconnect.server.dto.SearchResponseDto;
import com.projectconnect.server.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResponseDto> search(@RequestParam(defaultValue = "") String q) {
        return ResponseEntity.ok(searchService.search(q));
    }
}
