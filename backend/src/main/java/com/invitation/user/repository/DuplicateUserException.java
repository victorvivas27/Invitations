package com.invitation.user.repository;

/** Persistence-level unique conflict without leaking database details. */
public class DuplicateUserException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public DuplicateUserException(Throwable cause) {
        super("A unique user value already exists", cause);
    }
}
