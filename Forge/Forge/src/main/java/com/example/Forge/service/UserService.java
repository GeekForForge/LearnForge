package com.example.Forge.service;

import com.example.Forge.entity.User;
import com.example.Forge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepo;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public User register(User user) {

        return userRepo.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public Optional<User> getById(String userId) {
        return userRepo.findByIdWithProgress(userId);
    }

    public User updateProfile(User user) {
        return userRepo.save(user);
    }
}
