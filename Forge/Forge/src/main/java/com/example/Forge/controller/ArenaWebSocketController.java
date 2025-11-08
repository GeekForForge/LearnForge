package com.example.Forge.controller;

import com.example.Forge.model.ArenaMessage;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class ArenaWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, List<String>> rooms = new ConcurrentHashMap<>();
    private final Map<String, Map<String, ArenaMessage>> answers = new ConcurrentHashMap<>();

    public ArenaWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/arena/join")
    public void joinRoom(ArenaMessage msg) {
        rooms.computeIfAbsent(msg.getRoomId(), id -> new ArrayList<>());
        if (!rooms.get(msg.getRoomId()).contains(msg.getUserId())) {
            rooms.get(msg.getRoomId()).add(msg.getUserId());
        }

        // 1. Inform new joiner and all others
        msg.setAction("JOINED");
        messagingTemplate.convertAndSend("/topic/arena/" + msg.getRoomId(), msg);

        // 2. Broadcast full player list to update ALL clients (fixes your bug!)
        ArenaMessage playerListMsg = new ArenaMessage();
        playerListMsg.setAction("PLAYER_LIST");
        playerListMsg.setRoomId(msg.getRoomId());
        playerListMsg.setPlayers(new ArrayList<>(rooms.get(msg.getRoomId()))); // You need this field in your DTO!
        messagingTemplate.convertAndSend("/topic/arena/" + msg.getRoomId(), playerListMsg);
    }

    @MessageMapping("/arena/answer")
    public void submitAnswer(ArenaMessage msg) {
        answers.computeIfAbsent(msg.getRoomId(), id -> new HashMap<>());
        answers.get(msg.getRoomId()).put(msg.getUserId(), msg);

        msg.setAction("ANSWERED");
        messagingTemplate.convertAndSend("/topic/arena/" + msg.getRoomId(), msg);

        List<String> users = rooms.getOrDefault(msg.getRoomId(), new ArrayList<>());
        if (answers.get(msg.getRoomId()).size() == users.size()) {
            ArenaMessage result = new ArenaMessage();
            result.setRoomId(msg.getRoomId());
            result.setAction("ROUND_RESULT");
            messagingTemplate.convertAndSend("/topic/arena/" + msg.getRoomId(), result);
            answers.get(msg.getRoomId()).clear();
        }
    }
}
