package com.learnforge.service;// CompletionService.java
import com.learnforge.entity.CompletionId;
import com.learnforge.entity.QuestionCompletion;
import com.learnforge.repository.QuestionCompletionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompletionService {

    private final QuestionCompletionRepository repo;

    @Transactional(readOnly = true)
    public List<String> getCompleted(String userEmail, String companySlug) {
        return repo.findCompletedUids(userEmail, companySlug);
    }

    @Transactional
    public void upsertCompletion(String userEmail, String companySlug, String questionUid,
                                 boolean completed, String title, String link) {
        CompletionId id = new CompletionId(userEmail, companySlug, questionUid);
        QuestionCompletion entity = repo.findById(id).orElseGet(() ->
                QuestionCompletion.builder()
                        .userEmail(userEmail)
                        .companySlug(companySlug)
                        .questionUid(questionUid)
                        .questionTitle(title)
                        .questionLink(link)
                        .build());
        entity.setCompleted(completed);
        repo.save(entity);
    }

    @Transactional
    public void upsertBulk(String userEmail, String companySlug,
                           Collection<BulkItem> items) {
        for (BulkItem it : items) {
            upsertCompletion(userEmail, companySlug, it.questionUid(), it.completed(), it.title(), it.link());
        }
    }

    public record BulkItem(String questionUid, boolean completed, String title, String link) {}
}
