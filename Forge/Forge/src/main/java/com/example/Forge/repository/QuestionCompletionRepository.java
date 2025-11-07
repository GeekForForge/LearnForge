package com.example.Forge.repository;// QuestionCompletionRepository.java
import com.example.Forge.entity.CompletionId;
import com.example.Forge.entity.QuestionCompletion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionCompletionRepository extends JpaRepository<QuestionCompletion, CompletionId> {

    @Query("select qc.questionUid from QuestionCompletion qc " +
            "where qc.userEmail = :userEmail and qc.companySlug = :companySlug and qc.completed = true")
    List<String> findCompletedUids(String userEmail, String companySlug);

    @Modifying
    @Query("update QuestionCompletion qc set qc.completed = :completed where qc.userEmail = :userEmail " +
            "and qc.companySlug = :companySlug and qc.questionUid = :questionUid")
    int setCompleted(String userEmail, String companySlug, String questionUid, boolean completed);
}
