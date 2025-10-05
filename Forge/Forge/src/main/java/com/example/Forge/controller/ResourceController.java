package com.example.Forge.controller;

import com.example.Forge.entity.Resource;
import com.example.Forge.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/courses/{courseId}/lessons/{lessonId}/resources")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<Resource>> getResources(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {

        System.out.println("🎯 GET /courses/" + courseId + "/lessons/" + lessonId + "/resources");
        List<Resource> resources = resourceService.getResourcesByLessonId(lessonId);
        return ResponseEntity.ok(resources);
    }

    @PostMapping
    public ResponseEntity<Resource> addResource(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @RequestBody Resource resource) {

        System.out.println("🎯 POST /courses/" + courseId + "/lessons/" + lessonId + "/resources");
        System.out.println("📦 Received resource:");
        System.out.println("   - Title: " + resource.getTitle());
        System.out.println("   - Type: " + resource.getType());
        System.out.println("   - URL: " + resource.getUrl());
        System.out.println("   - Description: " + resource.getDescription());

        resource.setLessonId(lessonId);
        Resource saved = resourceService.addResource(resource);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{resourceId}")
    public ResponseEntity<Void> deleteResource(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @PathVariable Long resourceId) {

        System.out.println("🎯 DELETE resource: " + resourceId);
        resourceService.deleteResource(resourceId);
        return ResponseEntity.noContent().build();
    }


}
