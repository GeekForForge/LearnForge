package com.learnforge.repository;

import com.learnforge.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    // 🔹 Find questions by topic and difficulty
    List<Question> findByTopicAndDifficulty(String topic, String difficulty);

    // 🔹 Case-insensitive version (useful for mixed-topic inputs)
    List<Question> findByTopicIgnoreCaseAndDifficultyIgnoreCase(String topic, String difficulty);

    // 🔹 Get random questions (used for arena random battle)
    @Query(value = "SELECT * FROM question ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<Question> findRandomQuestions(@Param("count") int count);

    // 🔹 New method for DataLoader — check if question already exists
    Optional<Question> findByQuestionText(String questionText);
}
