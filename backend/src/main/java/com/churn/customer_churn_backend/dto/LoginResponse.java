package com.churn.customer_churn_backend.dto;

public class LoginResponse {

    private String message;
    private String email;
    private String role;

    public LoginResponse(String message, String email, String role) {
        this.message = message;
        this.email = email;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}