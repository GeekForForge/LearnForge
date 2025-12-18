package com.learnforge.controller;

import com.learnforge.model.ArenaMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
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

    // Handle player joining a room
    @MessageMapping("/arena/join")
    public void joinRoom(ArenaMessage msg) {
        rooms.computeIfAbsent(msg.getRoomId(), id -> new ArrayList<>());
        if (!rooms.get(msg.getRoomId()).contains(msg.getUserId())) {
            rooms.get(msg.getRoomId()).add(msg.getUserId());
        }
        System.out.println("JOIN received from: " + msg.getUserId() + " in room " + msg.getRoomId());

        // Notify everyone a player joined
        msg.setAction("JOINED");
        messagingTemplate.convertAndSend("/topic/arena/" + msg.getRoomId(), msg);

        // Send updated player list to all
        ArenaMessage listMsg = new ArenaMessage();
        listMsg.setAction("PLAYER_LIST");
        listMsg.setRoomId(msg.getRoomId());
        listMsg.setPlayers(new ArrayList<>(rooms.get(msg.getRoomId())));
        messagingTemplate.convertAndSend("/topic/arena/" + msg.getRoomId(), listMsg);
    }

    // Handle player chat messages
    @MessageMapping("/arena/chat")
    public void chat(ArenaMessage msg) {
        msg.setAction("CHAT");
        msg.setTimestamp(new Date().toString());
        messagingTemplate.convertAndSend("/topic/arena/" + msg.getRoomId(), msg);
    }

    // Handle player leaving
    @MessageMapping("/arena/leave")
    public void leave(ArenaMessage msg) {
        if (rooms.containsKey(msg.getRoomId())) {
            rooms.get(msg.getRoomId()).remove(msg.getUserId());
            msg.setAction("LEFT");
            messagingTemplate.convertAndSend("/topic/arena/" + msg.getRoomId(), msg);

            // Update player list
            ArenaMessage listMsg = new ArenaMessage();
            listMsg.setAction("PLAYER_LIST");
            listMsg.setRoomId(msg.getRoomId());
            listMsg.setPlayers(new ArrayList<>(rooms.get(msg.getRoomId())));
            messagingTemplate.convertAndSend("/topic/arena/" + msg.getRoomId(), listMsg);
        }
    }

    // Optional: Game answer logic (as you had)
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
