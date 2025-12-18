package com.learnforge.service;

import com.learnforge.model.ArenaResult;
import com.learnforge.repository.ArenaResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArenaResultService {
    private final ArenaResultRepository arenaResultRepository;

    public ArenaResult saveResult(ArenaResult result) {
        result.setAccuracy((double) result.getScore() / result.getTotalQuestions());
        return arenaResultRepository.save(result);
    }

    public List<ArenaResult> getLeaderboard(String topic) {
        if (topic != null && !topic.isEmpty()) {
            return arenaResultRepository.findTop10ByTopicOrderByAccuracyDesc(topic);
        }
        return arenaResultRepository.findTop10ByOrderByAccuracyDesc();
    }
}

