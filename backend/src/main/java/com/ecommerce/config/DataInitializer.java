package com.ecommerce.config;

import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DataInitializer {
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                String adminEmail = "pansarepriti09@gmail.com";
                String adminPassword = "123456789";

                userRepository.findByEmail(adminEmail).ifPresentOrElse(user -> {
                    user.setUsername(adminEmail);
                    user.setRole(Role.ROLE_ADMIN);
                    user.setPassword(passwordEncoder.encode(adminPassword));
                    user.setVerified(true);
                    userRepository.save(user);
                    logger.info("Updated existing admin account: {}", adminEmail);
                }, () -> {
                    User admin = User.builder()
                            .username(adminEmail)
                            .fullName("System Admin")
                            .email(adminEmail)
                            .password(passwordEncoder.encode(adminPassword))
                            .role(Role.ROLE_ADMIN)
                            .isVerified(true)
                            .build();

                    userRepository.save(admin);
                    logger.info("Created new custom admin account: {}", adminEmail);
                });
            } catch (Exception e) {
                logger.error("Error during data initialization: {}", e.getMessage());
            }
        };
    }
}
