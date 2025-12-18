package com.learnforge.dto;

import lombok.Data;

@Data
public class ExecuteResponse {
    private String stdout;
    private String stderr;
    private String time;
    private String status;
}
