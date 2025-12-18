package com.learnforge.config;

import com.learnforge.entity.User;
import com.learnforge.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserGoogleService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    public CustomOAuth2UserGoogleService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oauthUser = delegate.loadUser(userRequest);

        Map<String, Object> attributes = oauthUser.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");
        String sub = (String) attributes.get("sub"); // for Google, sub is user id

        // Find by email
        Optional<User> existing = userRepository.findByEmail(email);
        if (email != null && existing.isEmpty()) {
            User user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setAvatarUrl(picture);
            user.setProvider("google");
            user.setProviderId(sub);
            userRepository.save(user);
        } else if (email != null && existing.isPresent()) {
            // Optionally update avatar/name/provider info if changed!
            User user = existing.get();
            user.setAvatarUrl(picture);
            user.setName(name);
            user.setProvider("google");
            user.setProviderId(sub);
            userRepository.save(user);
        }

        return oauthUser;
    }
}
