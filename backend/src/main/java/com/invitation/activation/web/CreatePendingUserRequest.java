package com.invitation.activation.web;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreatePendingUserRequest(
        @NotBlank @Size(max = 201) @Pattern(regexp = ".*\\s+.*") String name,
        @NotBlank @Email @Size(max = 254) String email) { }
