package com.learnforge.controller;

import com.learnforge.entity.User;
import com.learnforge.service.CompletionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/completions")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "http://localhost:5173",
                "https://learn-forge-xi.vercel.app"
        },
        allowCredentials = "true"
)
@RequiredArgsConstructor
public class CompletionController {

    private final CompletionService service;


    private String getUserEmail(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        return user.getEmail();
    }


    @GetMapping("/{companySlug}")
    public Map<String, Object> getCompleted(
            @PathVariable String companySlug,
            HttpSession session) {

        String userEmail = getUserEmail(session);
        List<String> uids = service.getCompleted(userEmail, companySlug);
        return Map.of(
                "company", companySlug,
                "completedUids", uids
        );
    }


    @PostMapping("/{companySlug}/toggle")
    public void toggle(
            @PathVariable String companySlug,
            @RequestBody ToggleReq req,
            HttpSession session) {

        String userEmail = getUserEmail(session);
        service.upsertCompletion(
                userEmail,
                companySlug,
                req.questionUid(),
                req.completed(),
                req.title(),
                req.link()
        );
    }


    @PostMapping("/{companySlug}/bulk")
    public void bulk(
            @PathVariable String companySlug,
            @RequestBody BulkReq req,
            HttpSession session) {

        String userEmail = getUserEmail(session);
        service.upsertBulk(userEmail, companySlug, req.items());
    }


    public record ToggleReq(String questionUid, boolean completed, String title, String link) {}
    public record BulkReq(List<CompletionService.BulkItem> items) {}
}
