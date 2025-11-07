package com.example.Forge.dto;

import java.util.List;
import java.util.Map;

public class LeetCodeMetricsDto {
    public String handle;
    public int totalSolved;
    public int easy;
    public int medium;
    public int hard;
    public Map<String,Integer> calendar;
    public List<RecentSubmission> recent;
    public int currentStreak;
    public int longestStreak;
    public String lastFetched;

    public static class RecentSubmission {
        public String title;
        public String titleSlug;
        public long timestamp;
        public String verdict;
    }
}

