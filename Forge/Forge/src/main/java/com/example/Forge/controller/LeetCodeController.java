package com.example.Forge.controller;

import com.example.Forge.dto.LeetCodeMetricsDto;
import com.example.Forge.service.LeetCodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/leetcode")
public class LeetCodeController {
    private final LeetCodeService service;
    public LeetCodeController(LeetCodeService service) { this.service = service; }

    @GetMapping("/{handle}")
    public ResponseEntity<LeetCodeMetricsDto> get(@PathVariable String handle) throws Exception {
        return ResponseEntity.ok(service.getMetricsCached(handle));
    }

    @PostMapping("/sync/{handle}")
    public ResponseEntity<LeetCodeMetricsDto> sync(@PathVariable String handle) throws Exception {
        // Protect this endpoint (auth/rate-limit) in production
        return ResponseEntity.ok(service.forceRefresh(handle));
    }
}
