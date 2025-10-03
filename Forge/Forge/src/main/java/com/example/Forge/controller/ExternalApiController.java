package com.example.Forge.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/external")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ExternalApiController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/dev-articles")
    public ResponseEntity<?> getDevArticles() {
        try {
            String url = "https://dev.to/api/articles?tag=programming&per_page=6";
            Object response = restTemplate.getForObject(url, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Return mock data on failure
            List<Map<String, Object>> mockArticles = new ArrayList<>();
            for (int i = 1; i <= 6; i++) {
                Map<String, Object> article = new HashMap<>();
                article.put("id", i);
                article.put("title", "Programming Article " + i);
                article.put("description", "Learn about programming concepts");
                article.put("url", "https://dev.to");
                article.put("public_reactions_count", 100 + i * 10);
                article.put("comments_count", 10 + i);
                article.put("reading_time_minutes", 5);
                article.put("readable_publish_date", "Oct 3");

                Map<String, Object> user = new HashMap<>();
                user.put("name", "Developer " + i);
                user.put("profile_image_90", "https://via.placeholder.com/90");
                article.put("user", user);

                mockArticles.add(article);
            }
            return ResponseEntity.ok(mockArticles);
        }
    }

    @GetMapping("/trending-repos")
    public ResponseEntity<?> getTrendingRepos() {
        try {
            String url = "https://gh-trending-api.herokuapp.com/repositories?since=daily&spoken_language_code=en";
            Object response = restTemplate.getForObject(url, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Return mock data on failure
            List<Map<String, Object>> mockRepos = new ArrayList<>();
            String[] langs = {"JavaScript", "Python", "Java", "TypeScript", "Go"};

            for (int i = 0; i < 5; i++) {
                Map<String, Object> repo = new HashMap<>();
                repo.put("author", "developer" + (i + 1));
                repo.put("name", "awesome-project-" + (i + 1));
                repo.put("url", "https://github.com");
                repo.put("description", "An awesome open source project");
                repo.put("language", langs[i]);
                repo.put("stars", 10000 + i * 1000);
                repo.put("forks", 1000 + i * 100);
                repo.put("currentPeriodStars", 100 + i * 10);
                mockRepos.add(repo);
            }
            return ResponseEntity.ok(mockRepos);
        }
    }

    @GetMapping("/github-user/{username}")
    public ResponseEntity<?> getGithubUser(@PathVariable String username) {
        try {
            String url = "https://api.github.com/users/" + username;
            Object response = restTemplate.getForObject(url, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "GitHub API unavailable"));
        }
    }

    @GetMapping("/github-repos/{username}")
    public ResponseEntity<?> getGithubRepos(@PathVariable String username) {
        try {
            String url = "https://api.github.com/users/" + username + "/repos?sort=updated&per_page=5";
            Object response = restTemplate.getForObject(url, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "GitHub API unavailable"));
        }
    }

    @GetMapping("/trending-devs")
    public ResponseEntity<?> getTrendingDevs() {
        try {
            String reposUrl = "https://gh-trending-api.herokuapp.com/repositories?since=daily&spoken_language_code=en";
            Object response = restTemplate.getForObject(reposUrl, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/programming-meme")
    public ResponseEntity<?> getProgrammingMeme() {
        try {
            String url = "https://meme-api.com/gimme/ProgrammerHumor";
            Object response = restTemplate.getForObject(url, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "title", "Programming Humor",
                    "url", "https://reddit.com/r/ProgrammerHumor",
                    "postLink", "https://reddit.com/r/ProgrammerHumor"
            ));
        }
    }
}
