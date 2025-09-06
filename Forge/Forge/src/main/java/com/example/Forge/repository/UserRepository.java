package com.example.Forge.repository;

import com.example.Forge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    /**
     * Find user by email address
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if user exists by email
     */
    boolean existsByEmail(String email);

    /**
     * Find user by email and provider
     */
    Optional<User> findByEmailAndProvider(String email, String provider);

    /**
     * Get user with their progress data
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.progressList WHERE u.userId = :userId")
    Optional<User> findByIdWithProgress(@Param("userId") String userId);
}