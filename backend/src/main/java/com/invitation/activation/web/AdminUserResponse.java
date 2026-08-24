package com.invitation.activation.web;

import com.invitation.user.domain.UserRole;
import com.invitation.user.domain.UserStatus;

import java.time.Instant;

public record AdminUserResponse(String code, String firstName, String lastName, String email,
                                UserStatus status, UserRole role, Instant createdAt) {
}
