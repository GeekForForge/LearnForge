package com.example.Forge.service;

import com.example.Forge.dto.LeetCodeMetricsDto;
import com.example.Forge.leetcode.LeetCodeHandleRaw;
import com.example.Forge.repository.LeetCodeHandleRawRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.http.HttpStatus;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.time.*;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeetCodeService {
    private static final Logger log = LoggerFactory.getLogger(LeetCodeService.class);

    @Value("${leetcode.graphql.url}")
    private String graphQlUrl; // e.g. https://leetcode.com/graphql

    private WebClient webClient;
    private final ObjectMapper mapper;
    private final LeetCodeHandleRawRepository rawRepo;

    private static final String USER_QUERY = """
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        submissionCalendar
      }
    }
    """;


    public LeetCodeService(LeetCodeHandleRawRepository rawRepo) {
        this.mapper = new ObjectMapper();
        this.rawRepo = rawRepo;
    }

    @PostConstruct
    private void initWebClient() {
        // build a WebClient with common headers. We intentionally DO NOT set cookies here.
        this.webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
                .defaultHeader(HttpHeaders.REFERER, "https://leetcode.com/")
                .build();
    }

    @Cacheable(value = "leetcodeMetrics", key = "#handle")
    public LeetCodeMetricsDto getMetricsCached(String handle) throws Exception {
        return fetchAndCompute(handle);
    }

    public LeetCodeMetricsDto forceRefresh(String handle) throws Exception {
        // evicts cache via controller wrapper, but kept for compatibility
        return fetchAndCompute(handle);
    }

    /**
     * Primary method that builds the GraphQL body, sends the request,
     * persists raw JSON and computes metrics.
     */
    public LeetCodeMetricsDto fetchAndCompute(String handle) throws Exception {
        // GraphQL body
        Map<String, Object> body = Map.of(
                "query", USER_QUERY,
                "variables", Map.of("username", handle)
        );

        String bodyStr = mapper.writeValueAsString(body);
        log.debug("LeetCode GraphQL request body: {}", bodyStr);

        // send request and capture 4xx/5xx body to get real error
        String resp = webClient.post()
                .uri(URI.create(graphQlUrl))
                .bodyValue(body)
                .retrieve()
                // handle 4xx
                .onStatus(
                        status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class).flatMap(b -> {
                            log.error("LeetCode returned 4xx: status={}, body={}", response.statusCode(), b);
                            return Mono.<Throwable>error(new RuntimeException("LeetCode 4xx: " + b));
                        })
                )
                // handle 5xx
                .onStatus(
                        status -> status.is5xxServerError(),
                        response -> response.bodyToMono(String.class).flatMap(b -> {
                            log.error("LeetCode returned 5xx: status={}, body={}", response.statusCode(), b);
                            return Mono.<Throwable>error(new RuntimeException("LeetCode 5xx: " + b));
                        })
                )
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(20));


        if (resp == null) {
            throw new RuntimeException("empty response from LeetCode");
        }

        log.debug("LeetCode GraphQL raw response length: {}", resp.length());

        // persist raw JSON
        LeetCodeHandleRaw raw = new LeetCodeHandleRaw();
        raw.setHandle(handle);
        raw.setRawJson(resp);
        raw.setFetchedAt(Instant.now());
        rawRepo.save(raw);

        JsonNode root = mapper.readTree(resp);
        JsonNode matched = root.at("/data/matchedUser");
        if (matched.isMissingNode() || matched.isNull()) {
            // include root in message for debugging
            String snippet = root.has("errors") ? root.get("errors").toString() : root.toString();
            throw new RuntimeException("user not found or GraphQL changed. server payload: " + snippet);
        }

        LeetCodeMetricsDto out = new LeetCodeMetricsDto();
        out.handle = handle;

        // difficulties
        JsonNode acArr = matched.at("/submitStats/acSubmissionNum");
        if (acArr.isArray()) {
            for (JsonNode node : acArr) {
                String d = node.path("difficulty").asText("").toLowerCase();
                int count = node.path("count").asInt(0);
                if ("easy".equals(d)) out.easy = count;
                else if ("medium".equals(d)) out.medium = count;
                else if ("hard".equals(d)) out.hard = count;
            }
        }
        out.totalSolved = out.easy + out.medium + out.hard;

        // calendar
        out.calendar = new TreeMap<>();
        JsonNode cal = matched.get("submissionCalendar");
        if (cal != null && cal.isObject()) {
            Iterator<String> fields = cal.fieldNames();
            while (fields.hasNext()) {
                String date = fields.next();
                out.calendar.put(date, cal.get(date).asInt(0));
            }
        }

        // recent
        // recent
        out.recent = new ArrayList<>();
        JsonNode recent = matched.get("recentAcSubmissionList");
        if (recent != null && recent.isArray()) {
            for (JsonNode s : recent) {
                LeetCodeMetricsDto.RecentSubmission r = new LeetCodeMetricsDto.RecentSubmission();
                r.title = s.path("title").asText("");
                r.titleSlug = s.path("titleSlug").asText("");
                r.timestamp = s.path("timestamp").asLong(0);
                r.verdict = "AC";
                out.recent.add(r);
            }
        }


        // streaks
        var streaks = computeStreaks(out.calendar);
        out.currentStreak = streaks.current;
        out.longestStreak = streaks.longest;
        out.lastFetched = raw.getFetchedAt().toString();

        return out;
    }

    // same computeStreaks implementation you had (kept intact)
    private static class Streaks { int current; int longest; }

    private Streaks computeStreaks(Map<String,Integer> calendar) {
        Set<String> daysWith = calendar.entrySet().stream()
                .filter(e -> e.getValue() != null && e.getValue() > 0)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());

        int longest = 0;
        for (String d : daysWith) {
            LocalDate date = LocalDate.parse(d);
            if (!daysWith.contains(date.minusDays(1).toString())) {
                int len = 0;
                LocalDate cur = date;
                while (daysWith.contains(cur.toString())) { len++; cur = cur.plusDays(1); }
                longest = Math.max(longest, len);
            }
        }
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        int current = 0;
        LocalDate cur = today;
        while (daysWith.contains(cur.toString())) { current++; cur = cur.minusDays(1); }

        Streaks s = new Streaks();
        s.current = current;
        s.longest = longest;
        return s;
    }

    /**
     * OPTIONAL helper: If you still get 400 because LeetCode requires CSRF / session cookies,
     * call fetchCsrfAndCookies() once and then include the returned headers in the POST.
     *
     * Use pattern:
     *   var cookies = fetchCsrfAndCookies();
     *   webClient.post()
     *       .uri(URI.create(graphQlUrl))
     *       .headers(h -> h.addAll(cookies))
     *       .bodyValue(body)
     *       ...
     *
     * Implementation below shows how to perform a GET to the LeetCode homepage to extract cookies.
     */
    public org.springframework.http.HttpHeaders fetchCsrfAndCookies() {
        // quick GET to obtain cookies (csrftoken) from LeetCode homepage
        var resp = webClient.get()
                .uri("https://leetcode.com/")
                .exchangeToMono(clientResp ->
                        clientResp.toEntity(String.class))
                .block(Duration.ofSeconds(10));

        org.springframework.http.HttpHeaders out = new org.springframework.http.HttpHeaders();
        if (resp != null) {
            List<String> setCookies = resp.getHeaders().get(HttpHeaders.SET_COOKIE);
            if (setCookies != null) {
                // assemble Cookie header and attempt to find csrftoken
                StringBuilder cookieHeader = new StringBuilder();
                for (String c : setCookies) {
                    String pair = c.split(";", 2)[0];
                    if (cookieHeader.length() > 0) cookieHeader.append("; ");
                    cookieHeader.append(pair);
                }
                out.add(HttpHeaders.COOKIE, cookieHeader.toString());

                // try extract csrftoken
                for (String c : setCookies) {
                    if (c.toLowerCase().startsWith("csrftoken=") || c.toLowerCase().contains("csrftoken=")) {
                        String[] parts = c.split(";", 2);
                        String tokenPart = parts[0];
                        String token = tokenPart.split("=",2)[1];
                        out.add("x-csrftoken", token);
                        break;
                    }
                }
            }
        }
        return out;
    }
}
