package com.invitation.auth.application;

import com.invitation.user.domain.UserStatus;

public record PublicUser(String code, String firstName, String lastName, String email,
        UserStatus status) { }
