package com.invitation.activation.application;

import java.io.Serial;

public class ActivationTokenMalformedException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public ActivationTokenMalformedException() {
        super("Activation token is malformed");
    }
}
