package com.invitation.auth.domain;

import com.invitation.user.domain.UserStatus;

public record AuthenticatedUser(String code, String email, UserStatus status) {
}
