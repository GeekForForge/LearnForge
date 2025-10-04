package com.example.Forge.repository;

import com.example.Forge.entity.Course;
import com.example.Forge.entity.Progress;
import com.example.Forge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {

    // Find progress for a specific user and course
    Optional<Progress> findByUserAndCourse(User user, Course course);

    // Find all progress for a specific user
    List<Progress> findByUser(User user);

    // Find all progress for a specific course
    List<Progress> findByCourse(Course course);

    // Check if progress exists for user and course
    boolean existsByUserAndCourse(User user, Course course);

    // Delete all progress for a user
    void deleteByUser(User user);

    // Delete all progress for a course
    void deleteByCourse(Course course);

    // Find progress by user ID
    List<Progress> findByUser_UserId(String userId);

    // Find progress by course ID
    List<Progress> findByCourse_CourseId(Long courseId);
}