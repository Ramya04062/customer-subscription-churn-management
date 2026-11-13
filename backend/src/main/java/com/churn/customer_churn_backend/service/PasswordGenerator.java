package com.churn.customer_churn_backend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Scanner;

public class PasswordGenerator {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter admin password: ");
        String password = scanner.nextLine();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String hashedPassword = encoder.encode(password);

        System.out.println("\nBCrypt Password Hash:");
        System.out.println(hashedPassword);

        scanner.close();
    }
}