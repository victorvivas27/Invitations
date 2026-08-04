package com.invitation.user.web;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterUserRequest(
        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName,
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(min = 8, max = 72)
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$") String password) {

    public RegisterUserRequest(String firstName, String lastName, String email, String password) {
        this.firstName = trim(firstName);
        this.lastName = trim(lastName);
        this.email = trim(email);
        this.password = password;
    }

    private static String trim(String value) {
        return value == null ? null : value.trim();
    }
}
