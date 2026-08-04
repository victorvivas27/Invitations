package com.invitation.activation.application;
public class ActivationTokenMalformedException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public ActivationTokenMalformedException() { super("Activation token is malformed"); }
}
