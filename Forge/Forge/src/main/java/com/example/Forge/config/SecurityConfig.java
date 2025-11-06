package com.example.Forge.config;

import com.example.Forge.entity.User;
import com.example.Forge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomOAuth2UserGoogleService customOAuth2UserGoogleService;

    @Autowired
    private UserRepository userRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/courses/**").permitAll()
                        .requestMatchers("/error", "/actuator/**").permitAll()
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserGoogleService)
                        )
                        .successHandler(customSuccessHandler())
                        .defaultSuccessUrl("http://localhost:3000/", true)
                )
                .logout(logout -> logout.logoutSuccessUrl("/").permitAll());

        return http.build();
    }

    /**
     * ✅ Custom success handler:
     * Stores user in session and redirects to frontend.
     */
    @Bean
    public AuthenticationSuccessHandler customSuccessHandler() {
        return (request, response, authentication) -> {
            OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
            String email = (String) oauthUser.getAttribute("email");
            if (email != null) {
                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    request.getSession().setAttribute("user", user);
                    request.getSession().setAttribute("userId", user.getUserId());
                }
            }
            response.sendRedirect("http://localhost:3000/");
        };
    }

    /**
     * ✅ CORS configuration (Spring Boot 3.2+ compatible)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 🔒 Add all your frontend URLs here
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174",
                "https://learn-forge-xi.vercel.app"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization", "Set-Cookie"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
