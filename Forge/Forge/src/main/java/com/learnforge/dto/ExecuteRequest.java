package com.learnforge.dto;

import lombok.Data;

@Data
public class ExecuteRequest {
    private String language;
    private String code;
    private String input;
}
