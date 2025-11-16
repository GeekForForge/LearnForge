package com.example.Forge.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CodeChefMetricsDto {
    public String handle;

    @JsonProperty("rating") // <-- ADDED
    public int currentRating;

    @JsonProperty("highest_rating") // <-- ADDED
    public int highestRating;

    @JsonProperty("stars") // <-- This one is the same
    public String stars;

    @JsonProperty("global_rank") // <-- ADDED
    public String globalRank;

    @JsonProperty("country_rank") // <-- ADDED
    public String countryRank;

    public String lastFetched;

}