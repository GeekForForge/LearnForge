package com.example.Forge.repository;

import com.example.Forge.entity.Course;
import com.example.Forge.entity.Progress;
import com.example.Forge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByUserAndCourse(User user, Course course);

}
