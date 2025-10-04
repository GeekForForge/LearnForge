package com.example.Forge.dto;

import com.example.Forge.entity.Lesson;
import com.example.Forge.entity.LessonResource;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonWithResourcesDTO {
    private Lesson lesson;
    private List<LessonResource> resources;
}
