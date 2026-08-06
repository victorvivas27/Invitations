package com.invitation.auth.application;

import java.io.Serial;

public class InvalidCredentialsException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public InvalidCredentialsException() {
        super("Invalid email or password");
    }
}
