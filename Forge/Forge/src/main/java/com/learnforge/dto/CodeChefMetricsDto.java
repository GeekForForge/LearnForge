package com.learnforge.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CodeChefMetricsDto {
    public String handle;

    // Maps "rating" from JSON to this field
    @JsonProperty("rating")
    public int currentRating;

    // Maps "highest_rating" from JSON
    @JsonProperty("highest_rating")
    public int highestRating;

    @JsonProperty("stars")
    public String stars;

    // Maps "global_rank" from JSON
    @JsonProperty("global_rank")
    public String globalRank;

    // Maps "country_rank" from JSON
    @JsonProperty("country_rank")
    public String countryRank;

    public String lastFetched;
}
