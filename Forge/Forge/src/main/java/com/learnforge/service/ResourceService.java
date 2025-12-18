package com.learnforge.service;

import com.learnforge.entity.Resource;
import com.learnforge.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    // ✅ Get all resources by lesson ID (using relationship)
    public List<Resource> getResourcesByLessonId(Long lessonId) {
        System.out.println("📚 Getting resources for lesson: " + lessonId);
        List<Resource> resources = resourceRepository.findByLesson_LessonId(lessonId);
        System.out.println("✅ Found " + resources.size() + " resources");
        return resources;
    }

    // ✅ Add a single resource
    @Transactional
    public Resource addResource(Resource resource) {
        List<Resource> existing = resourceRepository.findByLesson_LessonId(resource.getLesson().getLessonId());
        boolean duplicate = existing.stream().anyMatch(r -> r.getUrl().equals(resource.getUrl()));
        if (duplicate) {
            System.out.println("⚠️ Skipping duplicate resource: " + resource.getUrl());
            return null;
        }
        return resourceRepository.save(resource);
    }


    // ✅ Delete a resource by ID
    @Transactional
    public void deleteResource(Long resourceId) {
        System.out.println("🗑️ Deleting resource: " + resourceId);
        resourceRepository.deleteById(resourceId);
        System.out.println("✅ Resource deleted");
    }

    // ✅ Save a batch of scraped resources at once
    @Transactional
    public void saveAll(List<Resource> resources) {
        if (resources == null || resources.isEmpty()) {
            System.out.println("⚠️ No resources to save.");
            return;
        }
        System.out.println("💾 Saving " + resources.size() + " scraped resources...");
        resourceRepository.saveAll(resources);
        System.out.println("✅ All resources saved successfully.");
    }
}
