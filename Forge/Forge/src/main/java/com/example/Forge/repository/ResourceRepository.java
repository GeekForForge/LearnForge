package com.example.Forge.repository;

import com.example.Forge.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {


    List<Resource> findByLesson_LessonId(Long lessonId);


    void deleteByLesson_LessonId(Long lessonId);
}
