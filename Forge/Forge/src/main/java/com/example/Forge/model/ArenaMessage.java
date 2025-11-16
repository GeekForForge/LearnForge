package com.example.Forge.model;

import lombok.Data;
import java.util.List;

@Data
public class ArenaMessage {
    private String roomId;
    private String userId;
    private String avatar;
    private String message;
    private String action;
    private String timestamp;
    private List<String> players;
}
