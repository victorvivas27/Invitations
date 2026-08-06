package com.invitation.user.application;

import java.io.Serial;

/**
 * Stable application error for an email that is already registered.
 */
public class DuplicateEmailException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public DuplicateEmailException() {
        super("An account with this email already exists");
    }

    public DuplicateEmailException(Throwable cause) {
        super("An account with this email already exists", cause);
    }
}
