package com.example.Forge.controller;
import com.example.Forge.service.someservice;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingContoller {
    private final someservice someservice;

    public PingContoller(com.example.Forge.service.someservice someservice) {
        this.someservice = someservice;
    }
    @GetMapping("/ping")
    @CrossOrigin(origins = {
            "http://localhost:3000",
            "http://localhost:5173",
            "https://learn-forge-xi.vercel.app"
    }, allowCredentials = "true")
    public String ping() {
        someservice.keepAliveCheck();
        return "I'm awake!";
    }
}
