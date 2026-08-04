package com.invitation.activation.application.port;

@FunctionalInterface
public interface ActivationTokenHasher {
    String hash(String token);
}
