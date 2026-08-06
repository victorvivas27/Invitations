package com.invitation.auth.web;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(@NotBlank @Email @Size(max = 254) String email,
                           @NotBlank @Size(max = 72) String password) {
    public LoginRequest(String email, String password) {
        this.email = normalize(email);
        this.password = password;
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
