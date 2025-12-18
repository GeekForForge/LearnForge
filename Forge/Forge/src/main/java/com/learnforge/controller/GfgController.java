package com.learnforge.controller;
import com.learnforge.service.GfgService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.learnforge.dto.GfgMetricsDto;
import com.learnforge.service.GfgService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gfg") // Changed to /api/gfg for consistency
public class GfgController {
    private final GfgService service;
    public GfgController(GfgService service) { this.service = service; }

    @GetMapping("/{handle}")
    public ResponseEntity<GfgMetricsDto> get(@PathVariable String handle) throws Exception {
        return ResponseEntity.ok(service.getMetricsCached(handle));
    }

    @PostMapping("/sync/{handle}")
    public ResponseEntity<GfgMetricsDto> sync(@PathVariable String handle) throws Exception {
        // Protect this endpoint (auth/rate-limit) in production
        return ResponseEntity.ok(service.forceRefresh(handle));
    }
}

