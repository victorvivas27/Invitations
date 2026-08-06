package com.invitation.auth.application.port;

import com.invitation.auth.domain.AuthenticatedUser;

import java.util.Optional;

@FunctionalInterface
public interface TokenValidator {
    Optional<AuthenticatedUser> validate(String token);
}
