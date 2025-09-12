
package com.example.Forge.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import java.util.*;

public class CustomOAuth2User implements OAuth2User {
    private OAuth2User oauth2User;
    private String provider;

    public CustomOAuth2User(OAuth2User oauth2User, String provider) {
        this.oauth2User = oauth2User;
        this.provider = provider;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getName() {
        return oauth2User.getAttribute("name");
    }

    public String getEmail() {
        return oauth2User.getAttribute("email");
    }

    public String getProvider() {
        return provider;
    }

    public String getProviderId() {
        Object id = oauth2User.getAttribute("id");
        return id != null ? id.toString() : null;
    }

    public String getAvatarUrl() {
        if ("github".equals(provider)) {
            return oauth2User.getAttribute("avatar_url");
        } else if ("google".equals(provider)) {
            return oauth2User.getAttribute("picture");
        }
        return null;
    }
}
