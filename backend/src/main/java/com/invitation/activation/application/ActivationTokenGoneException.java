package com.invitation.activation.application;

import java.io.Serial;

public class ActivationTokenGoneException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public ActivationTokenGoneException(String message) {
        super(message);
    }
}
