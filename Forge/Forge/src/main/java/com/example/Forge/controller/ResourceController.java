package com.example.Forge.controller;

import com.example.Forge.entity.Lesson;
import com.example.Forge.entity.Resource;
import com.example.Forge.repository.LessonRepository;
import com.example.Forge.service.ResourceService;
import com.example.Forge.service.ScraperService;
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

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ScraperService scraperService;

    // ✅ GET all resources for a lesson
    @GetMapping
    public ResponseEntity<List<Resource>> getResources(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {

        System.out.println("🎯 GET /courses/" + courseId + "/lessons/" + lessonId + "/resources");
        List<Resource> resources = resourceService.getResourcesByLessonId(lessonId);
        return ResponseEntity.ok(resources);
    }

    // ✅ POST manually add a resource
    @PostMapping
    public ResponseEntity<Resource> addResource(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @RequestBody Resource resource) {

        System.out.println("🎯 POST /courses/" + courseId + "/lessons/" + lessonId + "/resources");
        System.out.println("   - Title: " + resource.getTitle());
        System.out.println("   - Type: " + resource.getType());
        System.out.println("   - URL: " + resource.getUrl());

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id " + lessonId));
        resource.setLesson(lesson);

        Resource saved = resourceService.addResource(resource);
        return ResponseEntity.ok(saved);
    }

    // ✅ DELETE a specific resource
    @DeleteMapping("/{resourceId}")
    public ResponseEntity<Void> deleteResource(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @PathVariable Long resourceId) {

        System.out.println("🎯 DELETE resource: " + resourceId);
        resourceService.deleteResource(resourceId);
        return ResponseEntity.noContent().build();
    }

    // ✅ AUTO-FETCH new resources using the scraper
    @PostMapping("/auto-fetch")
    public ResponseEntity<List<Resource>> autoFetchResources(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {

        System.out.println("🤖 AUTO-FETCH /courses/" + courseId + "/lessons/" + lessonId + "/resources");

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id " + lessonId));

        // Use the scraper service to get mapped Resource entities
        List<Resource> scraped = scraperService.fetchAndMapResources(lesson.getLessonName(), lesson);

        // Save in DB
        resourceService.saveAll(scraped);

        return ResponseEntity.ok(scraped);
    }
}
