package com.learnforge.entity;
import com.learnforge.entity.CompletionId;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "question_completion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(CompletionId.class) // if you’re using composite key
public class QuestionCompletion {

    @Id
    @Column(name = "user_email", length = 100, nullable = false)
    private String userEmail;

    @Id
    @Column(name = "company_slug", length = 80, nullable = false)
    private String companySlug;

    @Id
    @Column(name = "question_uid", length = 160, nullable = false)
    private String questionUid;

    @Column(name = "completed", nullable = false)
    private boolean completed = true;

    @CreationTimestamp
    @Column(name = "completed_at", nullable = false, updatable = false)
    private LocalDateTime completedAt;   // Hibernate fills on INSERT

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;     // Hibernate updates on every UPDATE

    @Column(name = "question_title", columnDefinition = "TEXT")
    private String questionTitle;

    @Column(name = "question_link", columnDefinition = "TEXT")
    private String questionLink;
}
