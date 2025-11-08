package com.example.Forge.service;

import com.example.Forge.entity.Resource;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScraperService {

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Resource> fetchResources(String query) {
        System.out.println("🔍 Fetching resources for: " + query);
        Set<String> urls = new HashSet<>();
        List<Resource> results = new ArrayList<>();

        // ---------- 1️⃣ GeeksforGeeks (via Google) ----------
        try {
            String googleUrl = "https://www.google.com/search?q=" +
                    URLEncoder.encode(query + " site:geeksforgeeks.org", StandardCharsets.UTF_8);
            Document googleDoc = Jsoup.connect(googleUrl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(10000)
                    .get();

            for (Element link : googleDoc.select("a[href^=https://www.geeksforgeeks.org/]")) {
                String href = link.attr("href");
                if (href.contains("geeksforgeeks.org") && urls.add(href)) {
                    Resource r = new Resource();
                    r.setTitle(link.text().isEmpty() ? "GeeksforGeeks Article" : link.text());
                    r.setUrl(href);
                    r.setType("GFG");
                    r.setDescription("Detailed explanation from GeeksforGeeks about: " + query);
                    results.add(r);
                }
                if (results.size() >= 3) break;
            }
            System.out.println("✅ GFG results: " + results.size());
        } catch (Exception e) {
            System.err.println("⚠️ GFG fetch failed: " + e.getMessage());
        }

        // ---------- 2️⃣ LeetCode ----------
        try {
            String lcUrl = "https://leetcode.com/problemset/all/?search=" +
                    URLEncoder.encode(query, StandardCharsets.UTF_8);
            Document lcDoc = Jsoup.connect(lcUrl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(10000)
                    .get();

            for (Element problem : lcDoc.select("a[href^=/problems/]")) {
                String title = problem.text();
                String href = "https://leetcode.com" + problem.attr("href");
                if (!title.isEmpty() && urls.add(href)) {
                    Resource r = new Resource();
                    r.setTitle(title);
                    r.setUrl(href);
                    r.setType("LeetCode");
                    r.setDescription("LeetCode problem similar to: " + query);
                    results.add(r);
                }
                if (results.stream().filter(r -> "LeetCode".equals(r.getType())).count() >= 3) break;
            }
            System.out.println("✅ LeetCode results added");
        } catch (Exception e) {
            System.err.println("⚠️ LeetCode fetch failed: " + e.getMessage());
        }

        // ---------- 3️⃣ GitHub ----------
        try {
            String gitUrl = "https://api.github.com/search/repositories?q=" +
                    URLEncoder.encode(query, StandardCharsets.UTF_8);
            ResponseEntity<String> response = restTemplate.getForEntity(gitUrl, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String body = response.getBody();
                if (body.contains("\"html_url\"")) {
                    String[] parts = body.split("\"html_url\"");
                    for (int i = 1; i < Math.min(parts.length, 4); i++) {
                        String href = parts[i].split("\"")[1];
                        if (urls.add(href)) {
                            Resource r = new Resource();
                            r.setTitle("GitHub Repo for " + query);
                            r.setUrl(href);
                            r.setType("GitHub");
                            r.setDescription("GitHub open-source project related to " + query);
                            results.add(r);
                        }
                    }
                }
            }
            System.out.println("✅ GitHub results added");
        } catch (Exception e) {
            System.err.println("⚠️ GitHub fetch failed: " + e.getMessage());
        }

        // ---------- 4️⃣ StackOverflow ----------
        try {
            String soUrl = "https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=" +
                    URLEncoder.encode(query, StandardCharsets.UTF_8) + "&site=stackoverflow";
            ResponseEntity<String> response = restTemplate.getForEntity(soUrl, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String body = response.getBody();
                if (body.contains("\"link\"")) {
                    String[] parts = body.split("\"link\"");
                    for (int i = 1; i < Math.min(parts.length, 3); i++) {
                        String href = parts[i].split("\"")[1];
                        if (urls.add(href)) {
                            Resource r = new Resource();
                            r.setTitle("StackOverflow Thread: " + query);
                            r.setUrl(href);
                            r.setType("StackOverflow");
                            r.setDescription("Community Q&A related to " + query);
                            results.add(r);
                        }
                    }
                }
            }
            System.out.println("✅ StackOverflow results added");
        } catch (Exception e) {
            System.err.println("⚠️ StackOverflow fetch failed: " + e.getMessage());
        }

        // ---------- 5️⃣ YouTube ----------
        try {
            String ytUrl = "https://www.youtube.com/results?search_query=" +
                    URLEncoder.encode(query, StandardCharsets.UTF_8);
            Document ytDoc = Jsoup.connect(ytUrl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(10000)
                    .get();

            for (Element el : ytDoc.select("a[href^=/watch]")) {
                String href = "https://www.youtube.com" + el.attr("href");
                String title = el.attr("title");
                if (!title.isEmpty() && urls.add(href)) {
                    Resource r = new Resource();
                    r.setTitle(title);
                    r.setUrl(href);
                    r.setType("YouTube");
                    r.setDescription("YouTube tutorial about " + query);
                    results.add(r);
                }
                if (results.stream().filter(r -> "YouTube".equals(r.getType())).count() >= 2) break;
            }
            System.out.println("✅ YouTube results added");
        } catch (Exception e) {
            System.err.println("⚠️ YouTube fetch failed: " + e.getMessage());
        }

        // ---------- 6️⃣ Medium Blogs ----------
        try {
            String medUrl = "https://www.google.com/search?q=" +
                    URLEncoder.encode(query + " site:medium.com", StandardCharsets.UTF_8);
            Document medDoc = Jsoup.connect(medUrl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(10000)
                    .get();

            for (Element link : medDoc.select("a[href^=https://medium.com/]")) {
                String href = link.attr("href");
                if (href.contains("medium.com") && urls.add(href)) {
                    Resource r = new Resource();
                    r.setTitle(link.text().isEmpty() ? "Medium Article" : link.text());
                    r.setUrl(href);
                    r.setType("Blog");
                    r.setDescription("Blog article on " + query);
                    results.add(r);
                }
                if (results.stream().filter(r -> "Blog".equals(r.getType())).count() >= 3) break;
            }
            System.out.println("✅ Medium results added");
        } catch (Exception e) {
            System.err.println("⚠️ Medium fetch failed: " + e.getMessage());
        }

        // ---------- 7️⃣ Clean duplicates + limit ----------
        List<Resource> uniqueResults = results.stream()
                .filter(r -> r.getUrl() != null && !r.getUrl().isEmpty())
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(Resource::getUrl, r -> r, (a, b) -> a, LinkedHashMap::new),
                        m -> new ArrayList<>(m.values())
                ));

        System.out.println("✅ Final unique resources: " + uniqueResults.size());
        return uniqueResults.subList(0, Math.min(uniqueResults.size(), 15)); // Limit to top 15
    }
}
