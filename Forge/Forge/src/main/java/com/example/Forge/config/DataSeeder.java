package com.example.Forge.config;

import com.example.Forge.entity.Course;
import com.example.Forge.entity.Lesson;
import com.example.Forge.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedDatabase(CourseRepository courseRepo) {
        return args -> {
            if (courseRepo.count() == 0) {
                // Sample Course 1
                Course javaDSA = new Course(
                        "Data Structures and Algorithms in Java",
                        "Master DSA fundamentals using Java, from arrays to graphs.",
                        "Programming"
                );
                javaDSA.getLessons().addAll(List.of(
                        new Lesson("Intro to DSA", "https://youtu.be/8b1JEDvenQU", "15 min", javaDSA),
                        new Lesson("Arrays & Strings", "https://youtu.be/dQw4w9WgXcQ", "25 min", javaDSA),
                        new Lesson("Linked Lists", "https://youtu.be/dQw4w9WgXcQ", "30 min", javaDSA)
                ));

                // Sample Course 2
                Course springBoot = new Course(
                        "Spring Boot Mastery",
                        "Build REST APIs, microservices, and secure apps with Spring Boot.",
                        "Backend"
                );
                springBoot.getLessons().addAll(List.of(
                        new Lesson("Spring Boot Intro", "https://youtu.be/dQw4w9WgXcQ", "20 min", springBoot),
                        new Lesson("REST with Spring MVC", "https://youtu.be/dQw4w9WgXcQ", "30 min", springBoot)
                ));

                // Sample Course 3
                Course reactCourse = new Course(
                        "React Frontend Develop",
                        "Create responsive web apps with React, Hooks & Context API.",
                        "Frontend"
                );
                reactCourse.getLessons().addAll(List.of(
                        new Lesson("React Setup", "https://youtu.be/dQw4w9WgXcQ", "10 min", reactCourse),
                        new Lesson("React Hooks", "https://youtu.be/dQw4w9WgXcQ", "40 min", reactCourse)
                ));

                courseRepo.saveAll(List.of(javaDSA, springBoot, reactCourse));
                System.out.println(" Seeded sample courses into database.");
            }
        };
    }
}
