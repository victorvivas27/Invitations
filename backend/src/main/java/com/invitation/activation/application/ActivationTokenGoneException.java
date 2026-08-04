package com.invitation.activation.application;
public class ActivationTokenGoneException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public ActivationTokenGoneException(String message) { super(message); }
}
