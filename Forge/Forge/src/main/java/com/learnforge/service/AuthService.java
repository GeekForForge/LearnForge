package com.learnforge.service;

import com.learnforge.entity.User;
import com.learnforge.repository.UserRepository;
import com.learnforge.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;

import java.time.LocalDateTime;
import java.util.*;

/**
 * AuthService - handles Google + GitHub OAuth.
 * - GitHub: exchanges code, fetches /user, if email missing -> /user/emails
 * - Google: existing flow preserved
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${github.client.id}")
    private String githubClientId;

    @Value("${github.client.secret}")
    private String githubClientSecret;

    // Set this to whatever redirect URI you use in the authorization request
    // (frontend or backend)
    // Example: "http://localhost:3000/auth/callback" OR
    // "http://localhost:8080/api/auth/github/callback"
    @Value("${github.redirectUri:http://localhost:3000/auth/callback}")
    private String githubRedirectUri;

    @Value("${google.client.id}")
    private String googleClientId;

    @Value("${google.client.secret}")
    private String googleClientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    // ============ GITHUB OAUTH ============
    public Map<String, Object> authenticateWithGithub(String code) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Missing GitHub authorization code");
        }

        // exchange code -> access token (include redirect_uri to avoid mismatch)
        String accessToken = getGithubAccessToken(code, githubRedirectUri);

        // fetch public profile
        Map<String, Object> githubUser = getGithubUserInfo(accessToken);

        // create or update local user (resolve real email if necessary)
        User user = createOrUpdateGithubUser(githubUser, accessToken);

        // generate jwt as before
        String jwt = jwtUtil.generateToken(user.getUserId(), user.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);
        return response;
    }

    /**
     * Exchanges GitHub code for access token. Includes redirect_uri if provided.
     */
    private String getGithubAccessToken(String code, String redirectUri) {
        String url = "https://github.com/login/oauth/access_token";

        Map<String, String> body = new HashMap<>();
        body.put("client_id", githubClientId);
        body.put("client_secret", githubClientSecret);
        body.put("code", code);
        if (redirectUri != null && !redirectUri.isBlank()) {
            body.put("redirect_uri", redirectUri);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map respBody = response.getBody();
                if (respBody.containsKey("access_token")) {
                    return (String) respBody.get("access_token");
                } else {
                    throw new RuntimeException("Failed to get GitHub access token: " + respBody);
                }
            } else {
                throw new RuntimeException("Unexpected response from GitHub token endpoint: " + response);
            }
        } catch (Exception e) {
            throw new RuntimeException("GitHub OAuth token exchange failed: " + e.getMessage(), e);
        }
    }

    /**
     * Fetches basic GitHub profile using Bearer token.
     */
    private Map<String, Object> getGithubUserInfo(String accessToken) {
        String url = "https://api.github.com/user";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Accept", "application/vnd.github+json");
        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to fetch GitHub user info: " + response);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed fetching GitHub user: " + e.getMessage(), e);
        }
    }

    /**
     * Resolve email by checking profile first; if null, call /user/emails and pick
     * primary & verified.
     */
    private String resolveGithubEmail(String accessToken, Map<String, Object> githubUser) {
        String email = githubUser != null ? (String) githubUser.get("email") : null;
        if (email != null && !email.isBlank())
            return email;

        // call /user/emails
        try {
            String url = "https://api.github.com/user/emails";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.set("Accept", "application/vnd.github+json");
            HttpEntity<String> request = new HttpEntity<>(headers);

            ResponseEntity<List> resp = restTemplate.exchange(url, HttpMethod.GET, request, List.class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null && !resp.getBody().isEmpty()) {
                // the list will be a List of LinkedHashMap objects
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> emails = (List<Map<String, Object>>) resp.getBody();

                // 1) primary & verified
                for (Map<String, Object> e : emails) {
                    Boolean primary = (Boolean) e.get("primary");
                    Boolean verified = (Boolean) e.get("verified");
                    String em = (String) e.get("email");
                    if (Boolean.TRUE.equals(primary) && Boolean.TRUE.equals(verified) && em != null && !em.isBlank()) {
                        return em;
                    }
                }
                // 2) any verified
                for (Map<String, Object> e : emails) {
                    Boolean verified = (Boolean) e.get("verified");
                    String em = (String) e.get("email");
                    if (Boolean.TRUE.equals(verified) && em != null && !em.isBlank()) {
                        return em;
                    }
                }
                // 3) first available
                Map<String, Object> first = emails.get(0);
                return first != null ? (String) first.get("email") : null;
            }
            return null;
        } catch (Exception ex) {
            // log and return null; caller will handle fallback
            System.err.println("Failed to fetch github emails: " + ex.getMessage());
            return null;
        }
    }

    /**
     * Upsert user using providerId first; if not found then try email (to avoid
     * duplicates).
     * Also fills sensible defaults so DB fields aren't null for optional profile
     * fields.
     */
    private User createOrUpdateGithubUser(Map<String, Object> githubUser, String accessToken) {
        String githubId = githubUser != null && githubUser.get("id") != null ? String.valueOf(githubUser.get("id"))
                : null;

        Optional<User> optionalByProvider = Optional.empty();
        if (githubId != null)
            optionalByProvider = userRepository.findByProviderId(githubId);

        User user = optionalByProvider.orElse(new User());
        user.setProvider("github");
        user.setProviderId(githubId);

        // Resolve email robustly
        String email = resolveGithubEmail(accessToken, githubUser);
        if (email == null || email.isBlank()) {
            // LAST resort fallback - avoid failing entire flow; keep a recognizable
            // fallback
            String login = githubUser != null ? (String) githubUser.get("login") : null;
            email = (login != null && !login.isBlank()) ? (login + "@github.user") : (githubId + "@github.user");
            System.out.println("Warning: GitHub returned no email; using fallback: " + email);
        }

        // If not found by providerId, try to find by email to prevent dup accounts
        if (optionalByProvider.isEmpty() && email != null) {
            Optional<User> maybeByEmail = userRepository.findByEmail(email);
            if (maybeByEmail.isPresent()) {
                user = maybeByEmail.get();
            }
        }

        user.setEmail(email);

        // Name fallback: name -> login -> email prefix -> providerId
        String name = githubUser != null ? (String) githubUser.get("name") : null;
        if (name == null || name.isBlank()) {
            name = githubUser != null ? (String) githubUser.get("login") : null;
        }
        if (name == null || name.isBlank()) {
            name = email != null ? email.split("@")[0] : (githubId != null ? githubId : "github-user");
        }
        user.setName(name);

        // Avatar, bio, location defaults
        String avatar = githubUser != null ? (String) githubUser.get("avatar_url") : null;
        if (avatar == null || avatar.isBlank()) {
            // create a safe default avatar (optional)
            avatar = "https://ui-avatars.com/api/?name=" + urlEncode(name);
        }
        user.setAvatarUrl(avatar);

        user.setBio(githubUser != null && githubUser.get("bio") != null ? (String) githubUser.get("bio") : "");
        user.setLocation(
                githubUser != null && githubUser.get("location") != null ? (String) githubUser.get("location") : "");

        user.setUpdatedAt(LocalDateTime.now());
        if (user.getCreatedAt() == null)
            user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    // simple url encoding helper for avatar fallback
    private String urlEncode(String s) {
        try {
            return java.net.URLEncoder.encode(s == null ? "" : s, java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "user";
        }
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
            throw new RuntimeException("Google OAuth failed: " + e.getMessage(), e);
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
        String googleId = googleUser != null ? (String) googleUser.get("id") : null;
        String email = googleUser != null ? (String) googleUser.get("email") : null;

        // FIRST: Try finding by providerId
        Optional<User> optionalUser = googleId != null ? userRepository.findByProviderId(googleId) : Optional.empty();

        // SECOND: If not found, try finding by email
        if ((optionalUser == null || optionalUser.isEmpty()) && email != null) {
            optionalUser = userRepository.findByEmail(email);
        }

        User user = optionalUser.orElse(new User());

        user.setProvider("google");
        user.setProviderId(googleId);
        user.setEmail(email != null ? email : (googleId + "@google.user"));

        String name = googleUser != null ? (String) googleUser.get("name") : null;
        if (name == null || name.isEmpty()) {
            name = email != null ? email.split("@")[0] : googleId;
        }
        user.setName(name);

        user.setAvatarUrl(googleUser != null ? (String) googleUser.get("picture")
                : "https://ui-avatars.com/api/?name=" + urlEncode(name));
        user.setUpdatedAt(LocalDateTime.now());
        if (user.getCreatedAt() == null)
            user.setCreatedAt(LocalDateTime.now());

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
