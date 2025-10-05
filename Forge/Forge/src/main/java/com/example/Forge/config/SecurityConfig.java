package com.example.Forge.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authz -> authz
                        // ✅ ALLOW AUTH ENDPOINTS (LOGIN, LOGOUT, USER INFO)
                        .requestMatchers("/auth/**").permitAll()

                        // ✅ ALLOW ALL API ENDPOINTS
                        .requestMatchers("/api/**").permitAll()

                        // ✅ ALLOW COURSE ENDPOINTS
                        .requestMatchers("/courses/**").permitAll()

                        // ✅ ALLOW ERROR AND ACTUATOR
                        .requestMatchers("/error", "/actuator/**").permitAll()

                        // ✅ ALLOW EVERYTHING ELSE
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ Allow both ports
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5173",
                "https://learn-forge-xi.vercel.app"
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // ✅ CRITICAL - Must be true for cookies/sessions to work!
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
