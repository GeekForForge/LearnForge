package com.example.Forge.controller;

import com.example.Forge.entity.Course;
import com.example.Forge.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
        System.out.println("🎯 CourseController initialized!");
    }

    // ✅ GET - Get all courses
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        try {
            List<Course> courses = courseService.getAllCourses();
            System.out.println("🎯 Returning " + courses.size() + " courses");
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ GET - Get course by ID
    // In your CourseController.java, update this method:

    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        try {
            System.out.println("🎯 Fetching course with ID: " + id);
            Optional<Course> courseOpt = courseService.getCourseById(id); // 🎯 CHANGED from getCoursesByLessons

            if (courseOpt.isPresent()) {
                return ResponseEntity.ok(courseOpt.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("❌ Error fetching course " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }


    // 🎯 POST - Create new course
    @PostMapping("/courses")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        try {
            System.out.println("🎯 Creating course: " + course.getCourseTitle());
            Course savedCourse = courseService.saveCourse(course);
            System.out.println("✅ Course created with ID: " + savedCourse.getCourseId());
            return ResponseEntity.ok(savedCourse);
        } catch (Exception e) {
            System.err.println("❌ Error creating course: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🎯 PUT - Update existing course
    @PutMapping("/courses/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        try {
            System.out.println("🎯 Updating course ID: " + id);
            course.setCourseId(id);
            Course updatedCourse = courseService.saveCourse(course);
            System.out.println("✅ Course updated: " + updatedCourse.getCourseTitle());
            return ResponseEntity.ok(updatedCourse);
        } catch (Exception e) {
            System.err.println("❌ Error updating course: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🎯 DELETE - Delete course
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        try {
            System.out.println("🎯 Deleting course ID: " + id);
            courseService.deleteCourse(id);
            System.out.println("✅ Course deleted successfully");
            return ResponseEntity.ok("Course deleted successfully");
        } catch (Exception e) {
            System.err.println("❌ Error deleting course: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🎯 SEARCH - Search courses by keyword
    @GetMapping("/courses/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String keyword) {
        try {
            System.out.println("🎯 Searching courses with keyword: " + keyword);
            List<Course> courses = courseService.setCourse(keyword);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
