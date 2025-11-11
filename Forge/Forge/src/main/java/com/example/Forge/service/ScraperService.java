package com.example.Forge.service;

import com.example.Forge.entity.Resource;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class ScraperService {

    public List<Resource> fetchResources(String query) {
        System.out.println("🔍 Fetching relevant links for: " + query);
        List<Resource> results = new ArrayList<>();
        Set<String> urls = new HashSet<>();

        // List of target sites
        Map<String, String> sites = Map.of(
                "GFG", "geeksforgeeks.org",
                "LeetCode", "leetcode.com",
                "StackOverflow", "stackoverflow.com",
                "GitHub", "github.com"
        );

        for (Map.Entry<String, String> entry : sites.entrySet()) {
            String platform = entry.getKey();
            String domain = entry.getValue();

            try {
                String searchUrl = "https://www.google.com/search?q=" +
                        URLEncoder.encode(query + " site:" + domain, StandardCharsets.UTF_8);

                Document doc = Jsoup.connect(searchUrl)
                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                        .timeout(10000)
                        .get();

                int count = 0;
                for (Element link : doc.select("a[href^=https]")) {
                    String href = link.attr("href");
                    if (href.contains(domain)
                            && !href.contains("google.com")
                            && urls.add(href)
                            && count < 4) {

                        Resource r = new Resource();
                        r.setTitle(link.text().isEmpty() ? platform + " Resource" : link.text());
                        r.setUrl(href);
                        r.setType(platform);
                        r.setDescription(platform + " result for " + query);

                        results.add(r);
                        count++;
                    }
                }

                System.out.println("✅ " + platform + " results added: " + count);
            } catch (Exception e) {
                System.err.println("⚠️ " + platform + " scrape failed: " + e.getMessage());
            }
        }

        // Deduplicate final results
        Map<String, Resource> unique = new LinkedHashMap<>();
        for (Resource r : results) {
            unique.putIfAbsent(r.getUrl(), r);
        }

        List<Resource> finalResults = new ArrayList<>(unique.values());
        System.out.println("✅ Final unique links: " + finalResults.size());
        return finalResults;
    }
}
