package com.invitation.auth.domain;

import com.invitation.user.domain.UserStatus;
import com.invitation.user.domain.UserRole;

public record AuthenticatedUser(String code, String email, UserStatus status, UserRole role) {
    public AuthenticatedUser(String code, String email, UserStatus status) {
        this(code, email, status, UserRole.USER);
    }
}
