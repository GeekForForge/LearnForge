package com.example.Forge.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GfgMetricsDto {
    public String handle;

    @JsonProperty("problems_solved")
    public int totalProblemsSolved;

    @JsonProperty("easy_problems_solved")
    public int easy;

    @JsonProperty("medium_problems_solved")
    public int medium;

    @JsonProperty("hard_problems_solved")
    public int hard;

    @JsonProperty("total_score")
    public int overallCodingScore;

    public String lastFetched;
}