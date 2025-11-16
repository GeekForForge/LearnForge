package com.example.Forge.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GfgMetricsDto {
    public String handle;
    public int totalProblemsSolved;
    public int easy;
    public int medium;
    public int hard;
    public int overallCodingScore;
    public String lastFetched;

    // This nested class matches the "solve_Stats" object from the new API
    // Jackson will automatically call this function when it sees "solve_Stats"
    @JsonProperty("solve_Stats")
    private void unpackSolveStats(SolveStats stats) {
        if (stats != null) {
            this.totalProblemsSolved = stats.totalProblemsSolved;
            this.easy = stats.easyProblemsSolved;
            this.medium = stats.mediumProblemsSolved;
            this.hard = stats.hardProblemsSolved;
            this.overallCodingScore = stats.overallCodingScore;
        }
    }

    // A private static class to help Jackson map the nested JSON
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class SolveStats {
        @JsonProperty("total_problems_solved")
        public int totalProblemsSolved;

        @JsonProperty("easy_problems_solved")
        public int easyProblemsSolved;

        @JsonProperty("medium_problems_solved")
        public int mediumProblemsSolved;

        @JsonProperty("hard_problems_solved")
        public int hardProblemsSolved;

        @JsonProperty("overall_coding_score")
        public int overallCodingScore;
    }

    // Add any other top-level fields you need from the "info" object
    @JsonProperty("info")
    private void unpackInfo(Info info) {
        // You could grab user.name here if you wanted
        // e.g., this.handle = info.username;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Info {
        @JsonProperty("name")
        public String name;

        @JsonProperty("username")
        public String username;
    }
}