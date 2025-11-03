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
import java.util.Optional;
import org.springframework.util.LinkedMultiValueMap;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private jwtUtil jwtUtil;

    @Value("${github.client.id}")
    private String githubClientId;

    @Value("${github.client.secret}")
    private String githubClientSecret;

    @Value("${google.client.id}")
    private String googleClientId;

    @Value("${google.client.secret}")
    private String googleClientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    // ============ GITHUB OAUTH ============
    public Map<String, Object> authenticateWithGithub(String code) {
        String accessToken = getGithubAccessToken(code);
        Map<String, Object> githubUser = getGithubUserInfo(accessToken);
        User user = createOrUpdateGithubUser(githubUser);
        String jwt = jwtUtil.generateToken(user.getUserId(), user.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);
        return response;
    }

    private String getGithubAccessToken(String code) {
        String url = "https://github.com/login/oauth/access_token";
        Map<String, String> body = new HashMap<>();
        body.put("client_id", githubClientId);
        body.put("client_secret", githubClientSecret);
        body.put("code", code);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getBody() != null && response.getBody().containsKey("access_token")) {
                return (String) response.getBody().get("access_token");
            } else {
                throw new RuntimeException("Failed to get GitHub access token: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("GitHub OAuth failed: " + e.getMessage());
        }
    }

    private Map<String, Object> getGithubUserInfo(String accessToken) {
        String url = "https://api.github.com/user";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        return response.getBody();
    }

    private User createOrUpdateGithubUser(Map<String, Object> githubUser) {
        String githubId = String.valueOf(githubUser.get("id"));
        Optional<User> optionalUser = userRepository.findByProviderId(githubId);
        User user = optionalUser.orElse(new User());

        user.setProvider("github");
        user.setProviderId(githubId);

        String email = (String) githubUser.get("email");
        if (email == null || email.isEmpty()) {
            email = githubUser.get("login") + "@github.user";
        }
        user.setEmail(email);

        String name = (String) githubUser.get("name");
        if (name == null || name.isEmpty()) {
            name = (String) githubUser.get("login");
        }
        user.setName(name);

        user.setAvatarUrl((String) githubUser.get("avatar_url"));
        user.setBio((String) githubUser.get("bio"));
        user.setLocation((String) githubUser.get("location"));
        user.setUpdatedAt(LocalDateTime.now());

        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }

        return userRepository.save(user);
    }

    // ============ GOOGLE OAUTH ============
    public Map<String, Object> authenticateWithGoogle(String code) {
        String accessToken = getGoogleAccessToken(code);
        Map<String, Object> googleUser = getGoogleUserInfo(accessToken);
        User user = createOrUpdateGoogleUser(googleUser);
        String jwt = jwtUtil.generateToken(user.getUserId(), user.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);
        return response;
    }

    private String getGoogleAccessToken(String code) {
        String url = "https://oauth2.googleapis.com/token";

        LinkedMultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", googleClientId);
        body.add("client_secret", googleClientSecret);
        body.add("code", code);
        body.add("grant_type", "authorization_code");
        body.add("redirect_uri", "http://localhost:8080/api/auth/google/callback");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<LinkedMultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getBody() != null && response.getBody().containsKey("access_token")) {
                return (String) response.getBody().get("access_token");
            } else {
                throw new RuntimeException("Failed to get Google access token: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Google OAuth failed: " + e.getMessage());
        }
    }

    private Map<String, Object> getGoogleUserInfo(String accessToken) {
        String url = "https://www.googleapis.com/oauth2/v2/userinfo";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        return response.getBody();
    }

    private User createOrUpdateGoogleUser(Map<String, Object> googleUser) {
        String googleId = (String) googleUser.get("id");
        String email = (String) googleUser.get("email");

        // FIRST: Try finding by providerId
        Optional<User> optionalUser = userRepository.findByProviderId(googleId);

        // SECOND: If not found, try finding by email
        if (optionalUser.isEmpty() && email != null) {
            optionalUser = userRepository.findByEmail(email);
        }

        User user = optionalUser.orElse(new User());

        user.setProvider("google");
        user.setProviderId(googleId);
        user.setEmail(email != null ? email : googleId + "@google.user");
        String name = (String) googleUser.get("name");
        if (name == null || name.isEmpty()) {
            name = email != null ? email.split("@")[0] : googleId;
        }
        user.setName(name);

        user.setAvatarUrl((String) googleUser.get("picture"));
        user.setUpdatedAt(LocalDateTime.now());
        if (user.getCreatedAt() == null) user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    // UTILITY METHODS
    public User getUserByToken(String token) {
        String userId = jwtUtil.getUserIdFromToken(token);
        return userRepository.findById(userId).orElse(null);
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }
}
