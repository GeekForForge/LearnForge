package com.example.Forge.controller;

import com.example.Forge.entity.User;
import com.example.Forge.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;  // ✅ Also need this for Cookie class

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

    @PostMapping("/github")
    public ResponseEntity<?> githubAuth(
            @RequestBody Map<String, String> request,
            HttpSession session,
            HttpServletResponse response) {  // ✅ ADD THIS
        try {
            String code = request.get("code");
            System.out.println("🔐 GitHub auth with code: " + code);

            Map<String, Object> authResponse = authService.authenticateWithGithub(code);

            // ✅ Store user in session
            User user = (User) authResponse.get("user");
            if (user != null) {
                System.out.println("✅ User authenticated: " + user.getEmail());

                session.setAttribute("user", user);
                session.setAttribute("userId", user.getUserId());
                session.setMaxInactiveInterval(30 * 60);

                // ✅ MANUALLY SET COOKIE WITH CORRECT ATTRIBUTES
                Cookie cookie = new Cookie("JSESSIONID", session.getId());
                cookie.setPath("/");
                cookie.setHttpOnly(true);
                cookie.setSecure(true);  // ✅ Required for HTTPS
                cookie.setMaxAge(30 * 60);
                cookie.setAttribute("SameSite", "None");  // ✅ CRITICAL!
                response.addCookie(cookie);

                System.out.println("✅ Session cookie set: " + session.getId());
            }

            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            System.err.println("❌ Auth failed: " + e.getMessage());
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
