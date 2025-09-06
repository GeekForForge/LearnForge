package com.example.Forge.service;

import com.example.Forge.entity.Course;
import com.example.Forge.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    public final CourseRepository courseRepository;
//constructor
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
    //storing courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    //courses by id
    public Course getCourseById(long id) {
        return courseRepository.findById(id).orElse(null);
    }
    //courses by lessons
    public Optional<Course> getCoursesByLessons(Long id) {
        return courseRepository.findByIdWithLessons(id);    }


    //course saving
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }
    //searching  courses
    public List <Course> setCourse(String keyword) {
        return courseRepository.findByCourseTitleContainingIgnoreCase(keyword);
    }
    //public delete course
    public void deleteCourse(Long id ) {
        courseRepository.deleteById(id);
    }

    public Course updatecourse(Long id, Course course) {
        return courseRepository.findById(id).orElse(course);
    }
}
