package com.learnforge.service;

import com.learnforge.dto.GfgMetricsDto;
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
public class GfgService {
    private static final Logger log = LoggerFactory.getLogger(GfgService.class);

    // --- NEW, MORE RELIABLE API ---
    @Value("${gfg.api.url:https://gfg-stats-api.vercel.app}")
    private String gfgApiUrl;

    private WebClient webClient;
    private final ObjectMapper mapper;

    public GfgService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @PostConstruct
    private void initWebClient() {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000)
                .responseTimeout(Duration.ofSeconds(20));

        this.webClient = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
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
        // --- UPDATED API PATH ---
        String fullApiUrl = gfgApiUrl + "/api?username=" + handle;
        log.debug("Fetching GFG stats from: {}", fullApiUrl);

        String resp = webClient.get()
                .uri(URI.create(fullApiUrl))
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError(),
                        response -> {
                            log.warn("GFG API returned 4xx for handle '{}': status={}", handle, response.statusCode());
                            return Mono.empty();
                        }
                )
                .onStatus(
                        status -> status.is5xxServerError(),
                        response -> response.bodyToMono(String.class).flatMap(b -> {
                            log.error("GFG API returned 5xx: status={}, body={}", response.statusCode(), b);
                            return Mono.<Throwable>error(new RuntimeException("GFG API 5xx Error: " + b));
                        })
                )
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(30));

        if (resp == null) {
            log.warn("Empty response from GFG (likely 404 for handle '{}'), returning null", handle);
            return null;
        }

        if (resp.isBlank() || !resp.trim().startsWith("{")) {
            log.warn("Received non-JSON response from GFG for handle '{}': {}", handle, resp);
            return null;
        }

        log.debug("GFG API raw response length: {}", resp.length());

        // This API's structure matches our new DTO
        GfgMetricsDto dto = mapper.readValue(resp, GfgMetricsDto.class);

        if (dto.totalProblemsSolved == 0 && dto.overallCodingScore == 0) {
            log.warn("GFG user has 0 stats: {}", handle);
        }

        dto.handle = handle;
        dto.lastFetched = Instant.now().toString();

        return dto;
    }
}
