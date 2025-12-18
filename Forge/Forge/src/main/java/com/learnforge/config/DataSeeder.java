package com.learnforge.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnforge.model.Question;
import com.learnforge.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

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

            // Clear existing questions to ensure a clean slate (User requested restart with
            // new JSON)
            // Note: This might fail if there are foreign key constraints (e.g. from
            // arena_results)
            // If so, we might need to delete those first or catch the exception.
            try {
                long count = questionRepository.count();
                if (count > 0) {
                    System.out.println("🧹 Clearing " + count + " existing questions...");
                    questionRepository.deleteAll();
                    System.out.println("✅ Existing questions cleared.");
                }
            } catch (Exception e) {
                System.out.println("⚠️ Could not clear existing questions (likely used in results): " + e.getMessage());
                System.out.println("ℹ️ Proceeding with upsert/merge logic...");
            }

            List<QuestionJsonDto> dtos = objectMapper.readValue(inputStream,
                    new TypeReference<List<QuestionJsonDto>>() {
                    });
            int addedCount = 0;

            List<Question> existingQuestions = questionRepository.findAll();

            for (QuestionJsonDto dto : dtos) {
                // Check if question exists by text
                boolean exists = existingQuestions.stream()
                        .anyMatch(existing -> existing.getQuestionText() != null &&
                                existing.getQuestionText().equals(dto.getQuestion()));

                if (!exists) {
                    Question q = new Question();
                    q.setTopic(dto.getTopic());
                    q.setSubtopic(dto.getSubtopic());
                    q.setDifficulty(dto.getDifficulty());
                    q.setQuestionText(dto.getQuestion());
                    q.setExplanation(dto.getExplanation());
                    q.setCorrectAnswer(dto.getAnswer());

                    // Map options array to individual fields
                    if (dto.getOptions() != null && dto.getOptions().size() >= 4) {
                        q.setOptionA(dto.getOptions().get(0));
                        q.setOptionB(dto.getOptions().get(1));
                        q.setOptionC(dto.getOptions().get(2));
                        q.setOptionD(dto.getOptions().get(3));
                    }

                    questionRepository.save(q);
                    addedCount++;
                }
            }

            if (addedCount > 0) {
                System.out.println("✅ Added " + addedCount + " new questions from JSON.");
            } else {
                System.out.println("ℹ️ All questions from JSON already exist in DB.");
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
