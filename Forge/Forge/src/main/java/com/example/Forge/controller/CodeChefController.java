package com.example.Forge.controller;
import com.example.Forge.service.CodeChefService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Forge.dto.CodeChefMetricsDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/codechef")
public class CodeChefController {
    private final CodeChefService service;
    public CodeChefController(CodeChefService service) { this.service = service; }

    @GetMapping("/{handle}")
    public ResponseEntity<CodeChefMetricsDto> get(@PathVariable String handle) throws Exception {
        return ResponseEntity.ok(service.getMetricsCached(handle));
    }

    @PostMapping("/sync/{handle}")
    public ResponseEntity<CodeChefMetricsDto> sync(@PathVariable String handle) throws Exception {
        return ResponseEntity.ok(service.forceRefresh(handle));
    }
}

