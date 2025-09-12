
package com.example.Forge.controller;

import com.example.Forge.entity.User;
import com.example.Forge.security.CustomOAuth2User;
import com.example.Forge.security.CustomOAuth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private CustomOAuth2UserService userService;

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getName())) {

            if (authentication.getPrincipal() instanceof CustomOAuth2User) {
                CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();

                // Process and save user
                User user = userService.processOAuthPostLogin(
                        oauth2User.getEmail(),
                        oauth2User.getName(),
                        oauth2User.getAvatarUrl(),
                        oauth2User.getProvider(),
                        oauth2User.getProviderId()
                );

                Map<String, Object> response = new HashMap<>();
                response.put("authenticated", true);
                response.put("user", user);

                return ResponseEntity.ok(response);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", false);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }
}
