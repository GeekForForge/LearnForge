package com.example.Forge.repository;

import com.example.Forge.entity.LessonResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonResourceRepository extends JpaRepository<LessonResource, Long> {
    List<LessonResource> findByLessonIdOrderByDisplayOrderAsc(Long lessonId);
    List<LessonResource> findByLessonIdAndResourceType(Long lessonId, LessonResource.ResourceType resourceType);
    void deleteByLessonId(Long lessonId);
}
