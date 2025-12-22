package com.learnforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDto {
    private int rank;
    private String name;
    private String username;
    private String avatar;
    private int level;
    private long xp;
    private int streak;
    private String badge;
    private int positionChange;
    private int progress; // percentage to next level
}
