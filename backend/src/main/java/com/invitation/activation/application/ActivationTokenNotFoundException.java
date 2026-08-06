package com.invitation.activation.application;

import java.io.Serial;

public class ActivationTokenNotFoundException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public ActivationTokenNotFoundException() {
        super("Activation token was not found");
    }
}
