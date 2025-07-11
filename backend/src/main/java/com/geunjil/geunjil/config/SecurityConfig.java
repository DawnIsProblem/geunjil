package com.geunjil.geunjil.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(List.of(
                            "http://localhost:3000",
                            "http://localhost:5173"
                    ));
                    config.setAllowedMethods(List.of(
                            "GET",
                            "POST",
                            "DELETE",
                            "PATCH",
                            "OPTIONS"
                    ));
                    config.setAllowedHeaders(List.of(
                            "*"
                    ));
                    config.setAllowCredentials(true);
                    return config;
                }));

        return  http.build();
    }
}
