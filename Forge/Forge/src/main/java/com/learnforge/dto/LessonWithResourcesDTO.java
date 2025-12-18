package com.learnforge.dto;

import com.learnforge.entity.Lesson;
import com.learnforge.entity.Resource;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonWithResourcesDTO {
    private Lesson lesson;
    private List<Resource> resources;
}
