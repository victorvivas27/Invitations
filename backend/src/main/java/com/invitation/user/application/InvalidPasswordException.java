package com.invitation.user.application;

import java.io.Serial;

/**
 * Raised when a password does not satisfy the initial registration policy.
 */
public class InvalidPasswordException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public InvalidPasswordException() {
        super("Password must contain at least 8 characters, one letter, and one number");
    }
}
