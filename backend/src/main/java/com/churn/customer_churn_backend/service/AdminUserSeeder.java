package com.churn.customer_churn_backend.service;

import com.churn.customer_churn_backend.entity.User;
import com.churn.customer_churn_backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:}")
    private String adminPassword;

    public AdminUserSeeder(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            System.out.println(
                    "Admin account seeding skipped. Set ADMIN_EMAIL and ADMIN_PASSWORD to create it."
            );
            return;
        }

        if (userRepository.findByEmailIgnoreCase(adminEmail.trim()).isPresent()) {
            System.out.println("Admin account already exists.");
            return;
        }

        User admin = new User();

        admin.setEmail(adminEmail.trim());
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole("ADMIN");
        admin.setActive(true);

        userRepository.save(admin);

        System.out.println("Admin account created successfully.");
    }
}