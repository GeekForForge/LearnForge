//package com.example.Forge.config;
//
//import com.example.Forge.model.Question;
//import com.example.Forge.repository.QuestionRepository;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import jakarta.annotation.PostConstruct;
//import lombok.RequiredArgsConstructor;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.stereotype.Component;
//
//import java.io.File;
//import java.util.ArrayList;
//import java.util.List;
//
//@Component
//@RequiredArgsConstructor
//public class DataLoader {
//
//    private final QuestionRepository questionRepository;
//
//    @PostConstruct
//    public void loadData() {
//        try {
//            // ✅ Load from classpath instead of relative file path
//            File file = new ClassPathResource("questions.json").getFile();
//
//            ObjectMapper mapper = new ObjectMapper();
//            JsonNode root = mapper.readTree(file);
//
//            List<Question> questions = new ArrayList<>();
//
//            for (JsonNode node : root) {
//                Question q = new Question();
//
//                // ✅ Flexible key mapping for question text
//                q.setQuestionText(node.has("questionText")
//                        ? node.get("questionText").asText()
//                        : node.has("question")
//                        ? node.get("question").asText()
//                        : null);
//
//                // ✅ Handle options (either array or individual fields)
//                if (node.has("options") && node.get("options").isArray()) {
//                    JsonNode options = node.get("options");
//                    q.setOptionA(options.size() > 0 ? options.get(0).asText() : null);
//                    q.setOptionB(options.size() > 1 ? options.get(1).asText() : null);
//                    q.setOptionC(options.size() > 2 ? options.get(2).asText() : null);
//                    q.setOptionD(options.size() > 3 ? options.get(3).asText() : null);
//                } else {
//                    q.setOptionA(node.has("optionA") ? node.get("optionA").asText() : null);
//                    q.setOptionB(node.has("optionB") ? node.get("optionB").asText() : null);
//                    q.setOptionC(node.has("optionC") ? node.get("optionC").asText() : null);
//                    q.setOptionD(node.has("optionD") ? node.get("optionD").asText() : null);
//                }
//
//                // ✅ Handle correct answer and fallbacks
//                q.setCorrectAnswer(node.has("correctAnswer")
//                        ? node.get("correctAnswer").asText()
//                        : node.has("answer")
//                        ? node.get("answer").asText()
//                        : null);
//
//                // ✅ Topic, subtopic, difficulty, explanation with defaults
//                q.setTopic(node.has("topic") ? node.get("topic").asText() : "General");
//                q.setSubtopic(node.has("subtopic") ? node.get("subtopic").asText() : null);
//                q.setDifficulty(node.has("difficulty") ? node.get("difficulty").asText() : "medium");
//                q.setExplanation(node.has("explanation") ? node.get("explanation").asText() : null);
//
//                questions.add(q);
//            }
//
//            // ✅ Clear duplicates (optional but good for re-runs)
//            questionRepository.deleteAll();
//
//            questionRepository.saveAll(questions);
//            System.out.println("✅ Loaded " + questions.size() + " questions into the database.");
//
//        } catch (Exception e) {
//            System.err.println("❌ Failed to load questions.json: " + e.getMessage());
//            e.printStackTrace();
//        }
//    }
//}
