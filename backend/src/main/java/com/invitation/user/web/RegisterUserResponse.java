package com.invitation.user.web;

import com.invitation.user.domain.UserStatus;

import java.time.Instant;

public record RegisterUserResponse(String code, String firstName, String lastName, String email,
                                   UserStatus status, Instant createdAt) {
}
