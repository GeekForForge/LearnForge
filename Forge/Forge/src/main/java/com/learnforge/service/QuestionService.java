package com.learnforge.service;

import com.learnforge.model.Question;
import com.learnforge.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;

    public List<Question> getRandomQuestions(String topic, String difficulty, int limit) {
        List<Question> all = questionRepository.findByTopicAndDifficulty(topic, difficulty);
        Collections.shuffle(all);
        return all.stream().limit(limit).toList();
    }

}

