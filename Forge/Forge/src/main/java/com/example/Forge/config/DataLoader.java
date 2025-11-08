package com.example.Forge.config;

import com.example.Forge.model.Question;
import com.example.Forge.repository.QuestionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader {

    private final QuestionRepository questionRepository;

    @PostConstruct
    public void loadData() {
        try {
            // Load from classpath
            File file = new ClassPathResource("questions.json").getFile();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(file);

            List<Question> newQuestions = new ArrayList<>();
            int updated = 0;

            for (JsonNode node : root) {
                String questionText = node.has("questionText")
                        ? node.get("questionText").asText()
                        : node.has("question")
                        ? node.get("question").asText()
                        : null;

                if (questionText == null || questionText.isBlank()) continue;

                // ✅ Check if question already exists
                Question existing = questionRepository.findByQuestionText(questionText).orElse(null);

                if (existing != null) {
                    // Update existing question if needed
                    existing.setOptionA(node.has("optionA") ? node.get("optionA").asText() : existing.getOptionA());
                    existing.setOptionB(node.has("optionB") ? node.get("optionB").asText() : existing.getOptionB());
                    existing.setOptionC(node.has("optionC") ? node.get("optionC").asText() : existing.getOptionC());
                    existing.setOptionD(node.has("optionD") ? node.get("optionD").asText() : existing.getOptionD());
                    existing.setCorrectAnswer(node.has("correctAnswer") ? node.get("correctAnswer").asText() : existing.getCorrectAnswer());
                    existing.setTopic(node.has("topic") ? node.get("topic").asText() : existing.getTopic());
                    existing.setDifficulty(node.has("difficulty") ? node.get("difficulty").asText() : existing.getDifficulty());
                    existing.setExplanation(node.has("explanation") ? node.get("explanation").asText() : existing.getExplanation());
                    questionRepository.save(existing);
                    updated++;
                } else {
                    // Create new question
                    Question q = new Question();
                    q.setQuestionText(questionText);
                    q.setOptionA(node.has("optionA") ? node.get("optionA").asText() : null);
                    q.setOptionB(node.has("optionB") ? node.get("optionB").asText() : null);
                    q.setOptionC(node.has("optionC") ? node.get("optionC").asText() : null);
                    q.setOptionD(node.has("optionD") ? node.get("optionD").asText() : null);
                    q.setCorrectAnswer(node.has("correctAnswer") ? node.get("correctAnswer").asText()
                            : node.has("answer") ? node.get("answer").asText() : null);
                    q.setTopic(node.has("topic") ? node.get("topic").asText() : "General");
                    q.setDifficulty(node.has("difficulty") ? node.get("difficulty").asText() : "medium");
                    q.setExplanation(node.has("explanation") ? node.get("explanation").asText() : null);
                    newQuestions.add(q);
                }
            }

            if (!newQuestions.isEmpty()) {
                questionRepository.saveAll(newQuestions);
            }

            System.out.println("✅ Questions loaded successfully.");
            System.out.println("🆕 New added: " + newQuestions.size());
            System.out.println("🛠️ Updated existing: " + updated);
            System.out.println("📊 Total in DB: " + questionRepository.count());

        } catch (Exception e) {
            System.err.println("❌ Failed to load questions.json: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
