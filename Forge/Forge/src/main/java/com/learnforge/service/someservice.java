package com.learnforge.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class someservice {
    public void keepAliveCheck() {
        System.out.println("Ping received at " + LocalDateTime.now());
    }
}

