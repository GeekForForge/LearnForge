package com.example.Forge.controller;

import com.example.Forge.entity.Course;
import com.example.Forge.service.CourseService;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/courses")
//@PreAuthorize("hasRole('ADMIN')") // Spring Security annotation
public class AdminCourseController {
private CourseService courseSvc;
public AdminCourseController(CourseService courseSvc) {
    this.courseSvc = courseSvc;
}
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course saved = courseSvc.saveCourse(course);
        return ResponseEntity.ok(saved);
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
//        // Admin can edit courses
//        return ResponseEntity.ok(courseSvc.updatecourse(id, course));
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseSvc.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}
