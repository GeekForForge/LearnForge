package com.example.Forge.controller;

import com.example.Forge.entity.Course;
import com.example.Forge.entity.Lesson;
import com.example.Forge.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
public class CourseController {

private CourseService courseService;


    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
       return ResponseEntity.ok(courseService.getAllCourses());
   }
@GetMapping("/{id}")
    public ResponseEntity <Course> getCourseById(@PathVariable Long id) {
    return courseService.getCoursesByLessons(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}
@GetMapping("/search")
    public ResponseEntity<List<Course>> getCoursesByLessons(@RequestBody String keyword) {
        return ResponseEntity.ok(courseService.setCourse(keyword));
}

}
