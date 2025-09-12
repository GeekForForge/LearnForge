// src/main/java/com/example/Forge/repository/UserRepository.java
package com.example.Forge.repository;

import com.example.Forge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    boolean existsByEmail(String email);


    Optional<User> findByEmailAndProvider(String email, String provider);
}
