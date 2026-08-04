package com.invitation.user.application;

import com.invitation.user.domain.UserStatus;
import java.time.Instant;

/** Public registration result. It intentionally has no internal ID or password hash. */
public record RegisteredUser(String code, String firstName, String lastName, String email,
        UserStatus status, Instant createdAt) { }
