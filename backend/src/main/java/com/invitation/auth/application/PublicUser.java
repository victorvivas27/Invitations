package com.invitation.auth.application;

import com.invitation.user.domain.UserStatus;
import com.invitation.user.domain.UserRole;

public record PublicUser(String code, String firstName, String lastName, String email,
                         UserStatus status, UserRole role) {
}
