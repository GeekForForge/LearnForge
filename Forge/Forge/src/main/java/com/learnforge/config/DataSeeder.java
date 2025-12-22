package com.learnforge.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnforge.model.Question;
import com.learnforge.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    private final QuestionRepository questionRepository;
    private final ObjectMapper objectMapper;

    public DataSeeder(QuestionRepository questionRepository, ObjectMapper objectMapper) {
        this.questionRepository = questionRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        seedQuestions();
    }

    private void seedQuestions() {
        try {
            InputStream inputStream = TypeReference.class.getResourceAsStream("/questions.json");
            if (inputStream == null) {
                System.out.println("❌ questions.json not found in resources!");
                return;
            }

            List<QuestionJsonDto> dtos = objectMapper.readValue(inputStream,
                    new TypeReference<List<QuestionJsonDto>>() {
                    });

            long dbParams = questionRepository.count();
            // Optimization: If DB has roughly same amount of data and we assume it's good,
            // we could skip.
            // But to fix "null options" issue, we act smart:
            // Fetch all and map by Question Text for O(1) lookup.
            List<Question> existingQuestions = questionRepository.findAll();
            Map<String, Question> questionMap = new HashMap<>();
            for (Question q : existingQuestions) {
                if (q.getQuestionText() != null) {
                    questionMap.put(q.getQuestionText(), q);
                }
            }

            int addedCount = 0;
            int updatedCount = 0;

            List<Question> toSave = new ArrayList<>();

            for (QuestionJsonDto dto : dtos) {
                Question existing = questionMap.get(dto.getQuestion());

                if (existing != null) {
                    // Check if options are missing (fixing the null issue)
                    if (existing.getOptionA() == null && dto.getOptions() != null && dto.getOptions().size() >= 4) {
                        existing.setOptionA(dto.getOptions().get(0));
                        existing.setOptionB(dto.getOptions().get(1));
                        existing.setOptionC(dto.getOptions().get(2));
                        existing.setOptionD(dto.getOptions().get(3));

                        // Also update other possibly missing fields if needed
                        existing.setCorrectAnswer(dto.getAnswer());
                        existing.setExplanation(dto.getExplanation());

                        toSave.add(existing);
                        updatedCount++;
                    }
                } else {
                    // Create new
                    Question q = new Question();
                    q.setTopic(dto.getTopic());
                    q.setSubtopic(dto.getSubtopic());
                    q.setDifficulty(dto.getDifficulty());
                    q.setQuestionText(dto.getQuestion());
                    q.setExplanation(dto.getExplanation());
                    q.setCorrectAnswer(dto.getAnswer());

                    if (dto.getOptions() != null && dto.getOptions().size() >= 4) {
                        q.setOptionA(dto.getOptions().get(0));
                        q.setOptionB(dto.getOptions().get(1));
                        q.setOptionC(dto.getOptions().get(2));
                        q.setOptionD(dto.getOptions().get(3));
                    }

                    toSave.add(q);
                    addedCount++;
                }
            }

            if (!toSave.isEmpty()) {
                questionRepository.saveAll(toSave);
                System.out.println("✅ Data Seeding: Added " + addedCount + " new, Updated " + updatedCount
                        + " existing questions.");
            } else {
                System.out.println("✅ All questions are up to date.");
            }

        } catch (IOException e) {
            System.out.println("❌ Error seeding data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // DTO to match questions.json structure
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class QuestionJsonDto {
        private Long id;
        private String topic;
        private String subtopic;
        private String difficulty;
        private String question;
        private List<String> options;
        private String answer;
        private String explanation;
    }
}
