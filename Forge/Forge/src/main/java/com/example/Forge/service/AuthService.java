package com.example.Forge.service;

import com.example.Forge.entity.User;
import com.example.Forge.repository.UserRepository;
import com.example.Forge.util.jwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private jwtUtil jwtUtil;

    @Value("${github.client.id}")
    private String clientId;

    @Value("${github.client.secret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> authenticateWithGithub(String code) {
        // Exchange code for access token
        String accessToken = getGithubAccessToken(code);

        // Get user info from GitHub
        Map<String, Object> githubUser = getGithubUserInfo(accessToken);

        // Create or update user
        User user = createOrUpdateUser(githubUser);

        // Generate JWT token with GitHub unique ID and username
        String jwt = jwtUtil.generateToken(user.getGithubId(), user.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);

        return response;
    }

    private String getGithubAccessToken(String code) {
        String url = "https://github.com/login/oauth/access_token";

        Map<String, String> body = new HashMap<>();
        body.put("client_id", clientId);
        body.put("client_secret", clientSecret);
        body.put("code", code);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        return (String) response.getBody().get("access_token");
    }

    private Map<String, Object> getGithubUserInfo(String accessToken) {
        String url = "https://api.github.com/user";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);

        return response.getBody();
    }

    private User createOrUpdateUser(Map<String, Object> githubUser) {
        String githubId = String.valueOf(githubUser.get("id"));

        User user = userRepository.findByProviderId(githubId)
                .orElse(new User());

        user.setProvider("github");
        user.setProviderId(githubId);
        user.setUsername((String) githubUser.get("login"));
        user.setEmail((String) githubUser.get("email"));
        user.setAvatarUrl((String) githubUser.get("avatar_url"));
        user.setName((String) githubUser.get("name"));
        user.setBio((String) githubUser.get("bio"));
        user.setLocation((String) githubUser.get("location"));
        user.setUpdatedAt(LocalDateTime.now());

        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }

        return userRepository.save(user);
    }

    public User getUserByToken(String token) {
        String githubId = jwtUtil.getGithubIdFromToken(token);
        return userRepository.findByProviderId(githubId).orElse(null);
    }
}
