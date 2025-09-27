package com.example.Forge.service;

import com.example.Forge.entity.Course;
import com.example.Forge.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // Get all courses
    public List<Course> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        System.out.println("Found " + courses.size() + " courses in database");
        return courses;
    }

    // 🎯 SIMPLIFIED - Get course by ID
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    // 🚨 REMOVED getCoursesByLessons - we don't need it anymore
    // Use getCourseById instead, and fetch lessons separately with LessonService

    // Save course
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    // Search courses
    public List<Course> setCourse(String keyword) {
        return courseRepository.findByCourseTitleContainingIgnoreCase(keyword);
    }

    // Delete course
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    // Update course
    public Course updateCourse(Long id, Course updatedCourse) {
        return courseRepository.findById(id)
                .map(course -> {
                    course.setCourseTitle(updatedCourse.getCourseTitle());
                    course.setCourseDescription(updatedCourse.getCourseDescription());
                    course.setCategory(updatedCourse.getCategory());
                    course.setDifficulty(updatedCourse.getDifficulty());
                    course.setInstructor(updatedCourse.getInstructor());
                    course.setDuration(updatedCourse.getDuration());
                    course.setStudents(updatedCourse.getStudents());
                    course.setRating(updatedCourse.getRating());
                    return courseRepository.save(course);
                })
                .orElse(null);
    }
}
