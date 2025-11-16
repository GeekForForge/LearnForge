package com.example.Forge.service;

import com.example.Forge.dto.GfgMetricsDto;
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
public class GfgService {
    private static final Logger log = LoggerFactory.getLogger(GfgService.class);

    @Value("${gfg.api.url:https://gfg-api-cyan.vercel.app}")
    private String gfgApiUrl;

    private WebClient webClient;
    private final ObjectMapper mapper;

    public GfgService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @PostConstruct
    private void initWebClient() {
        this.webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .build();
    }

    @Cacheable(value = "gfgMetrics", key = "#handle")
    public GfgMetricsDto getMetricsCached(String handle) throws Exception {
        return fetchAndCompute(handle);
    }

    public GfgMetricsDto forceRefresh(String handle) throws Exception {
        return fetchAndCompute(handle);
    }

    public GfgMetricsDto fetchAndCompute(String handle) throws Exception {
        String fullApiUrl = gfgApiUrl + "/" + handle;
        log.debug("Fetching GFG stats from: {}", fullApiUrl);

        String resp = webClient.get()
                .uri(URI.create(fullApiUrl))
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError(), // Handle 4xx
                        response -> {
                            log.warn("GFG API returned 4xx for handle '{}': status={}", handle, response.statusCode());
                            return Mono.empty(); // This will result in a null response
                        }
                )
                .onStatus(
                        status -> status.is5xxServerError(), // Handle 5xx
                        response -> response.bodyToMono(String.class).flatMap(b -> {
                            log.error("GFG API returned 5xx: status={}, body={}", response.statusCode(), b);
                            return Mono.<Throwable>error(new RuntimeException("GFG API 5xx Error: " + b));
                        })
                )
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(20));

        if (resp == null) {
            log.warn("Empty response from GFG (likely 404 for handle '{}'), returning null", handle);
            return null; // Return null, frontend will handle this
        }

        // --- THIS IS THE NEW FIX ---
        // Check if the response is actually JSON.
        if (resp.isBlank() || !resp.trim().startsWith("{")) {
            log.warn("Received non-JSON response from GFG for handle '{}': {}", handle, resp);
            return null; // Not valid JSON, treat as not found
        }
        // --- END OF NEW FIX ---

        log.debug("GFG API raw response length: {}", resp.length());

        GfgMetricsDto dto = mapper.readValue(resp, GfgMetricsDto.class);

        // This is the line that was cut off in your prompt, now fixed.
        if (dto.totalProblemsSolved == 0 && dto.overallCodingScore == 0) {
            log.warn("GFG user has 0 stats: {}", handle);
            // We still return the DTO, this is not an error
        }

        dto.handle = handle;
        dto.lastFetched = Instant.now().toString();

        return dto;
    }
}