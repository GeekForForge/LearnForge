package com.example.Forge.controller;

import com.example.Forge.model.ArenaResult;
import com.example.Forge.service.ArenaResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/arena")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ArenaResultController {

    private final ArenaResultService arenaResultService;

    @PostMapping("/result")
    public ArenaResult saveResult(@RequestBody ArenaResult result) {
        return arenaResultService.saveResult(result);
    }

    @GetMapping("/leaderboard")
    public List<ArenaResult> getLeaderboard(@RequestParam(required = false) String topic) {
        return arenaResultService.getLeaderboard(topic);
    }
}


