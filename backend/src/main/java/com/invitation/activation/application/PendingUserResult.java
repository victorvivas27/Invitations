package com.invitation.activation.application;

import com.invitation.user.domain.UserStatus;

public record PendingUserResult(String code, String name, String email, UserStatus status) {
}
