package com.invitation.user.domain;

/** Lifecycle states supported by a user account. */
public enum UserStatus {
    PENDING_ACTIVATION,
    ACTIVE,
    SUSPENDED,
    DELETION_PENDING,
    DELETED
}
