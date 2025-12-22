package com.learnforge.service;

import com.learnforge.dto.CodeChefMetricsDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelOption;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.net.URI;
import java.time.Duration;
import java.time.Instant;

@Service
public class CodeChefService {
    private static final Logger log = LoggerFactory.getLogger(CodeChefService.class);

    // --- NEW, MORE RELIABLE API ---
    @Value("${codechef.api.url:https://competitive-coding-api.herokuapp.com}")
    private String codechefApiUrl;

    private WebClient webClient;
    private final ObjectMapper mapper;

    public CodeChefService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @PostConstruct
    private void initWebClient() {
        // Configure a patient HttpClient for free services
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000) // 10 second connection timeout
                .responseTimeout(Duration.ofSeconds(20)); // 20 second response timeout

        this.webClient = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient)) // Apply the custom HttpClient
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
        // --- UPDATED API PATH - Using more reliable API ---
        String fullApiUrl = "https://codechef-api.vercel.app/handle/" + handle;
        log.debug("Fetching CodeChef stats from: {}", fullApiUrl);

        String resp = webClient.get()
                .uri(URI.create(fullApiUrl))
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError(),
                        response -> {
                            log.warn("CodeChef API returned 4xx for handle '{}': status={}", handle,
                                    response.statusCode());
                            return Mono.empty();
                        })
                .onStatus(
                        status -> status.is5xxServerError(),
                        response -> response.bodyToMono(String.class).flatMap(b -> {
                            log.error("CodeChef API returned 5xx: status={}, body={}", response.statusCode(), b);
                            return Mono.<Throwable>error(new RuntimeException("CodeChef API 5xx Error: " + b));
                        }))
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(30));

        if (resp == null) {
            log.warn("Empty response from CodeChef (likely 404 for handle '{}'), returning null", handle);
            return null;
        }

        if (resp.isBlank() || !resp.trim().startsWith("{")) {
            log.warn("Received non-JSON response from CodeChef for handle '{}': {}", handle, resp);
            return null;
        }

        log.debug("CodeChef API raw response length: {}", resp.length());

        // This API returns a status field
        JsonNode root = mapper.readTree(resp);
        if (root.has("status") && root.get("status").asText().equalsIgnoreCase("Failed")) {
            log.warn("CodeChef API returned 'User not found' for handle '{}'", handle);
            return null;
        }

        // This API structure matches our DTO
        CodeChefMetricsDto dto = mapper.treeToValue(root, CodeChefMetricsDto.class);

        if (dto.currentRating == 0 && dto.highestRating == 0) {
            log.warn("CodeChef API returned 0 stats for handle '{}'", handle);
        }

        dto.handle = handle;
        dto.lastFetched = Instant.now().toString();

        return dto;
    }
}
