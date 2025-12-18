// src/main/java/com/example/Forge/security/CustomOAuth2UserService.java
package com.learnforge.security;

import com.learnforge.entity.User;
import com.learnforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);
        String provider = userRequest.getClientRegistration().getRegistrationId();

        return new CustomOAuth2User(user, provider);
    }

    public User processOAuthPostLogin(String email, String name, String avatarUrl,
                                      String provider, String providerId) {

        // First try to find by email
        User existingUser = userRepository.findByEmail(email).orElse(null);

        if (existingUser == null) {
            // Create new user with your existing constructor
            User newUser = new User(name, email, avatarUrl, provider, providerId);
            return userRepository.save(newUser);
        } else {
            // Update existing user info
            existingUser.setName(name);
            existingUser.setAvatarUrl(avatarUrl);

            // Update provider info if it was null
            if (existingUser.getProvider() == null) {
                existingUser.setProvider(provider);
                existingUser.setProviderId(providerId);
            }

            return userRepository.save(existingUser);
        }
    }
}
