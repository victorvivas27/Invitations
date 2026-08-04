package com.invitation.activation.application;
public class ActivationTokenNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public ActivationTokenNotFoundException() { super("Activation token was not found"); }
}
