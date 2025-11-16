// src/main/java/com/example/Forge/service/ScraperService.java
package com.example.Forge.service;

import com.example.Forge.entity.Lesson;
import com.example.Forge.entity.Resource;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class ScraperService {

    public List<Resource> fetchAndMapResources(String query, Lesson lesson) {
        List<Resource> resources = new ArrayList<>();
        try {
            HttpClient client = HttpClient.newHttpClient();
            ObjectMapper mapper = new ObjectMapper();

            // Prepare payload for Python microservice
            Map<String, Object> payload = new HashMap<>();
            payload.put("query", query);
            payload.put("limit", 4);

            String jsonBody = mapper.writeValueAsString(payload);

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("http://127.0.0.1:8000/fetch")) // match port/run of your FastAPI server
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());

            if (resp.statusCode() == 200) {
                // Unwrap the grouped 'results' object
                Map<String, Object> fullResp = mapper.readValue(resp.body(), new TypeReference<>() {});
                Map<String, List<Map<String, Object>>> results =
                        (Map<String, List<Map<String, Object>>>) fullResp.get("results");

                if (results != null) {
                    for (List<Map<String, Object>> group : results.values()) {
                        for (Map<String, Object> entry : group) {
                            Resource resource = new Resource();
                            resource.setTitle((String) entry.get("title"));
                            resource.setType((String) entry.get("type"));
                            resource.setUrl((String) entry.get("url"));

                            // Set description from scraped.summary, fallback to scraped.snippet
                            Map<String, Object> scraped = (Map<String, Object>) entry.get("scraped");
                            if (scraped != null) {
                                String summary = (String) scraped.get("summary");
                                String snippet = (String) scraped.get("snippet");
                                resource.setDescription(
                                        summary != null && !summary.isEmpty() ? summary : snippet
                                );
                            }
                            // Set Lesson reference from parameter
                            resource.setLesson(lesson);
                            resources.add(resource);
                        }
                    }
                }
            } else {
                System.err.println("Python microservice error: " + resp.statusCode());
            }
        } catch (Exception e) {
            System.err.println("Error calling Python microservice: " + e.getMessage());
        }
        return resources;
    }
}

