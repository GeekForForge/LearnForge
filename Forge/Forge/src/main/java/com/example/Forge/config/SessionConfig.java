package com.example.Forge.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

@Configuration
public class SessionConfig {

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("JSESSIONID");
        serializer.setSameSite("None");  // ✅ CRITICAL for cross-domain
        serializer.setUseSecureCookie(true);  // ✅ Required for SameSite=None
        serializer.setCookiePath("/");
        serializer.setDomainNamePattern("^.+$");  // ✅ Allow all domains
        return serializer;
    }
}
