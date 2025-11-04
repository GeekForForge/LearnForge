package com.example.Forge.controller;

import com.example.Forge.entity.User;
import com.example.Forge.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173",
        "https://learn-forge-xi.vercel.app"
}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    // GITHUB OAUTH HANDLER
    @PostMapping("/github")
    public ResponseEntity<?> githubAuth(
            @RequestBody Map<String, String> request,
            HttpSession session,
            HttpServletResponse response) {
        try {
            String code = request.get("code");
            Map<String, Object> authResponse = authService.authenticateWithGithub(code);

            User user = (User) authResponse.get("user");
            if (user != null) {
                session.setAttribute("user", user);
                session.setAttribute("userId", user.getUserId());
                session.setMaxInactiveInterval(30 * 60);

                // Session cookie is auto-created, just ensure proper settings
                Cookie cookie = new Cookie("JSESSIONID", session.getId());
                cookie.setPath("/");
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setMaxAge(30 * 60);
                response.addCookie(cookie);
            }
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "GitHub authentication failed: " + e.getMessage()));
        }
    }

    // GOOGLE OAUTH HANDLER - receives authorization code from React popup
    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(
            @RequestBody Map<String, String> request,
            HttpSession session,
            HttpServletResponse response) {
        try {
            String code = request.get("code");
            Map<String, Object> authResponse = authService.authenticateWithGoogle(code);

            User user = (User) authResponse.get("user");
            if (user != null) {
                session.setAttribute("user", user);
                session.setAttribute("userId", user.getUserId());
                session.setMaxInactiveInterval(30 * 60);

                Cookie cookie = new Cookie("JSESSIONID", session.getId());
                cookie.setPath("/");
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setMaxAge(30 * 60);
                response.addCookie(cookie);
            }
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Google authentication failed: " + e.getMessage()));
        }
    }

    // GOOGLE OAUTH CALLBACK - Spring handles initial redirect (backup endpoint)
    @GetMapping("/google/callback")
    public void googleCallback(
            @RequestParam String code,
            HttpServletResponse response,
            HttpSession session) throws IOException, IOException {
        try {
            Map<String, Object> authResponse = authService.authenticateWithGoogle(code);

            User user = (User) authResponse.get("user");
            if (user != null) {
                session.setAttribute("user", user);
                session.setAttribute("userId", user.getUserId());
                session.setMaxInactiveInterval(30 * 60);

                Cookie cookie = new Cookie("JSESSIONID", session.getId());
                cookie.setPath("/");
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setMaxAge(30 * 60);
                response.addCookie(cookie);

                // ✅ Redirect to home or landing page!
                response.sendRedirect("http://localhost:3000/"); // or "/" for landing
                return;
            }
            response.sendRedirect("http://localhost:3000/login?error=google");
        } catch (Exception e) {
            response.sendRedirect("http://localhost:3000/login?error=google");
        }
    }

    // GET CURRENT USER (from session)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getUserId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("avatarUrl", user.getAvatarUrl());
            response.put("bio", user.getBio());
            response.put("location", user.getLocation());
            response.put("isAdmin", user.getIsAdmin() != null ? user.getIsAdmin() : false);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }

    // CHECK AUTH STATUS
    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(Map.of(
                    "authenticated", true,
                    "email", user.getEmail()
            ));
        }
        return ResponseEntity.ok(Map.of("authenticated", false));
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
