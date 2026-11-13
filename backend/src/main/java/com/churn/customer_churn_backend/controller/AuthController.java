
package com.churn.customer_churn_backend.controller;

import com.churn.customer_churn_backend.dto.LoginRequest;
import com.churn.customer_churn_backend.dto.LoginResponse;
import com.churn.customer_churn_backend.entity.User;
import com.churn.customer_churn_backend.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request) {

        User user = authService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword(),
                request
        );

        LoginResponse response = new LoginResponse(
                "Login successful",
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            HttpServletRequest request) {

        authService.logout(request);

        return ResponseEntity.ok(
                Map.of("message", "Logout successful")
        );
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse> getCurrentUser(
            HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null ||
                session.getAttribute("ADMIN_USER_ID") == null) {
            return ResponseEntity.status(401).build();
        }

        LoginResponse response = new LoginResponse(
                "Authenticated",
                (String) session.getAttribute("ADMIN_EMAIL"),
                (String) session.getAttribute("ADMIN_ROLE")
        );

        return ResponseEntity.ok(response);
    }
}
