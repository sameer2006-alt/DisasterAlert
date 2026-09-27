package com.disaster.controller;

import com.disaster.dto.SocialAnalyzeRequest;
import com.disaster.dto.SocialAnalyzeResponse;
import com.disaster.service.SocialNlpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/social")
public class SocialMediaController {

    private final SocialNlpService socialNlpService;

    public SocialMediaController(SocialNlpService socialNlpService) {
        this.socialNlpService = socialNlpService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<SocialAnalyzeResponse> analyze(@RequestBody SocialAnalyzeRequest request) {
        SocialAnalyzeResponse response = socialNlpService.analyzePost(request);
        return ResponseEntity.ok(response);
    }
}