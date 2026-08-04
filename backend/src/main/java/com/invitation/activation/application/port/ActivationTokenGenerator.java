package com.invitation.activation.application.port;

@FunctionalInterface
public interface ActivationTokenGenerator {
    String generate();
}
