package com.example.Forge.service;

import com.example.Forge.entity.Course;
import com.example.Forge.entity.Progress;
import com.example.Forge.entity.User;
import com.example.Forge.repository.CourseRepository;
import com.example.Forge.repository.ProgressRepository;
import com.example.Forge.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProgressService {
    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    public ProgressService(ProgressRepository progressRepository, UserRepository userRepository, CourseRepository courseRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }
    public Progress recordProgress(String userId, Long courseId,int completeness) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        Progress prog = new Progress(completeness, user, course);
        return progressRepository.save(prog);
    }
}
