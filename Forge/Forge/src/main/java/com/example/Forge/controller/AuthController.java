package com.example.Forge.controller;

import com.example.Forge.entity.User;
import com.example.Forge.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/github")
    public ResponseEntity<?> githubAuth(@RequestBody Map<String, String> request, HttpSession session) {
        try {
            String code = request.get("code");
            System.out.println("🔐 GitHub auth with code: " + code);
            System.out.println("📋 Session ID (before): " + session.getId());
            System.out.println("📋 Session isNew: " + session.isNew());

            Map<String, Object> response = authService.authenticateWithGithub(code);

            // ✅ Store user in session
            User user = (User) response.get("user");
            if (user != null) {
                System.out.println("✅ User authenticated: " + user.getEmail());
                System.out.println("✅ User isAdmin: " + user.getIsAdmin());
                System.out.println("✅ Storing user in session...");

                session.setAttribute("user", user);
                session.setAttribute("userId", user.getUserId());
                session.setMaxInactiveInterval(30 * 60); // 30 minutes

                System.out.println("✅ Session ID (after): " + session.getId());
                System.out.println("✅ User stored in session successfully!");

                // Verify it was stored
                User storedUser = (User) session.getAttribute("user");
                System.out.println("✅ Verification - User from session: " + (storedUser != null ? storedUser.getEmail() : "NULL"));
            } else {
                System.out.println("❌ No user in response!");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Auth failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Authentication failed: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        try {
            System.out.println("🔍 /auth/me called - Session ID: " + session.getId());

            User user = (User) session.getAttribute("user");

            if (user != null) {
                System.out.println("✅ User found in session: " + user.getEmail() + " | isAdmin: " + user.getIsAdmin());

                // Return user directly from session
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

            System.out.println("❌ No user in session");
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
    }


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

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        System.out.println("👋 Logging out - Session ID: " + session.getId());
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
