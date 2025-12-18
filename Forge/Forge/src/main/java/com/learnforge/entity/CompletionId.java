package com.learnforge.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data @NoArgsConstructor @AllArgsConstructor
public class CompletionId implements Serializable {
    private String userEmail;
    private String companySlug;
    private String questionUid;
}
