package com.invitation.user.domain;

/** Lifecycle states supported by a user account. */
public enum UserStatus {
    ACTIVE,
    SUSPENDED,
    DELETION_PENDING,
    DELETED
}
