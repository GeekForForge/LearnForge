package com.example.Forge.service;

import com.example.Forge.entity.Resource;
import com.example.Forge.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getResourcesByLessonId(Long lessonId) {
        System.out.println("📚 Getting resources for lesson: " + lessonId);
        List<Resource> resources = resourceRepository.findByLessonId(lessonId);
        System.out.println("✅ Found " + resources.size() + " resources");
        return resources;
    }

    @Transactional
    public Resource addResource(Resource resource) {
        System.out.println("➕ Adding resource: " + resource.getTitle());
        Resource saved = resourceRepository.save(resource);
        System.out.println("✅ Resource saved with ID: " + saved.getId());
        return saved;
    }

    @Transactional
    public void deleteResource(Long resourceId) {
        System.out.println("🗑️ Deleting resource: " + resourceId);
        resourceRepository.deleteById(resourceId);
        System.out.println("✅ Resource deleted");
    }
}
