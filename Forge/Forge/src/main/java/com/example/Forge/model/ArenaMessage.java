package com.example.Forge.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArenaMessage {
    private String roomId;
    private String userId;
    private String action;
    private String message;
    private int questionIndex;
    private String answer;
    private int score;
    private List<String> players;


}
