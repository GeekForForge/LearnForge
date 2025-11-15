package com.example.Forge.service;

import com.example.Forge.dto.CodeChefMetricsDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.net.URI;
import java.time.Duration;
import java.time.Instant;

@Service
public class CodeChefService {
    private static final Logger log = LoggerFactory.getLogger(CodeChefService.class);

    @Value("${codechef.api.url:https://code-chef-api.onrender.com}")
    private String codechefApiUrl;

    private WebClient webClient;
    private final ObjectMapper mapper;

    public CodeChefService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @PostConstruct
    private void initWebClient() {
        this.webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .build();
    }

    @Cacheable(value = "codechefMetrics", key = "#handle")
    public CodeChefMetricsDto getMetricsCached(String handle) throws Exception {
        return fetchAndCompute(handle);
    }

    public CodeChefMetricsDto forceRefresh(String handle) throws Exception {
        return fetchAndCompute(handle);
    }

    public CodeChefMetricsDto fetchAndCompute(String handle) throws Exception {
        String fullApiUrl = codechefApiUrl + "/" + handle;
        log.debug("Fetching CodeChef stats from: {}", fullApiUrl);

        String resp = webClient.get()
                .uri(URI.create(fullApiUrl))
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError(), // Handle 4xx
                        response -> {
                            log.warn("CodeChef API returned 4xx for handle '{}': status={}", handle, response.statusCode());
                            return Mono.empty();
                        }
                )
                .onStatus(
                        status -> status.is5xxServerError(), // Handle 5xx
                        response -> response.bodyToMono(String.class).flatMap(b -> {
                            log.error("CodeChef API returned 5xx: status={}, body={}", response.statusCode(), b);
                            return Mono.<Throwable>error(new RuntimeException("CodeChef API 5xx Error: " + b));
                        })
                )
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(20));

        if (resp == null) {
            log.warn("Empty response from CodeChef (likely 404 for handle '{}'), returning null", handle);
            return null; // Return null, frontend will handle this
        }

        // --- THIS IS THE NEW FIX ---
        // Check if the response is actually JSON. Some broken APIs return "Not Found" as text with a 200 OK status.
        if (resp.isBlank() || !resp.trim().startsWith("{")) {
            log.warn("Received non-JSON response from CodeChef for handle '{}': {}", handle, resp);
            return null; // Not valid JSON, treat as not found
        }
        // --- END OF NEW FIX ---

        log.debug("CodeChef API raw response length: {}", resp.length());

        JsonNode root = mapper.readTree(resp); // This line was line 86

        if (!root.path("success").asBoolean(false)) {
            log.warn("CodeChef API returned success: false for handle '{}'", handle);
            return null; // Return null, frontend will handle this
        }

        CodeChefMetricsDto dto = mapper.treeToValue(root, CodeChefMetricsDto.class);
        dto.handle = handle;
        dto.lastFetched = Instant.now().toString();

        return dto;
    }
}