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
        return resourceRepository.findByLessonId(lessonId);
    }

    @Transactional
    public Resource addResource(Resource resource) {
        System.out.println("➕ Adding resource: " + resource.getTitle());
        return resourceRepository.save(resource);
    }

    @Transactional
    public void deleteResource(Long resourceId) {
        System.out.println("🗑️ Deleting resource: " + resourceId);
        resourceRepository.deleteById(resourceId);
    }
}
