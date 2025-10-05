package com.example.Forge.repository;

import com.example.Forge.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByLessonId(Long lessonId);
    void deleteByLessonId(Long lessonId);
}
