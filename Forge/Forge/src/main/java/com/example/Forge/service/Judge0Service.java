package com.example.Forge.service;

import com.example.Forge.dto.ExecuteRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class Judge0Service {

    @Value("${judge0.api.url}")
    private String judge0ApiUrl;

    @Value("${judge0.api.key}")
    private String apiKey;

    @Value("${judge0.api.host}")
    private String apiHost;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> execute(ExecuteRequest request) {
        try {
            // Step 1: Submit code
            String token = submitCode(request);
            if (token == null) {
                throw new RuntimeException("Failed to get submission token");
            }

            // Step 2: Poll until done
            return pollResult(token);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return error;
        }
    }

    private String submitCode(ExecuteRequest request) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("source_code", request.getCode());
        payload.put("language_id", getLanguageId(request.getLanguage()));
        payload.put("stdin", request.getInput() != null ? request.getInput() : "");
        payload.put("cpu_time_limit", 3);
        payload.put("wall_time_limit", 10);
        payload.put("memory_limit", 128000);

        HttpHeaders headers = createHeaders();
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        String url = judge0ApiUrl + "/submissions?base64_encoded=false&wait=false";

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("token")) {
            return (String) body.get("token");
        }
        return null;
    }

    private Map<String, Object> pollResult(String token) throws InterruptedException {
        HttpHeaders headers = createHeaders();
        String url = judge0ApiUrl + "/submissions/" + token + "?base64_encoded=false";

        int maxAttempts = 20;
        int delayMs = 800;

        for (int i = 0; i < maxAttempts; i++) {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity(headers), Map.class);
            Map<String, Object> result = response.getBody();

            if (result != null) {
                Object statusObj = result.get("status");
                if (statusObj instanceof Map<?, ?> statusMap) {
                    Integer statusId = (Integer) statusMap.get("id");
                    // 1 = In Queue, 2 = Processing
                    if (statusId != null && statusId > 2) {
                        return result; // Done
                    }
                }
            }
            TimeUnit.MILLISECONDS.sleep(delayMs);
        }

        throw new RuntimeException("Submission timed out");
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-RapidAPI-Key", apiKey);
        headers.set("X-RapidAPI-Host", apiHost);
        headers.set("User-Agent", "ForgeApp/1.0");
        return headers;
    }

    private HttpEntity<?> entity(HttpHeaders headers) {
        return new HttpEntity<>(headers);
    }

    private int getLanguageId(String lang) {
        return switch (lang.toLowerCase()) {
            case "cpp", "c++" -> 54;
            case "c" -> 50;
            case "java" -> 62;
            case "python", "py" -> 71;
            case "javascript", "js", "node" -> 63;
            default -> 63;
        };
    }
}