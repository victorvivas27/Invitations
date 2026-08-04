package com.invitation.activation.application.port;

@FunctionalInterface
public interface ValidateActivationTokenUseCase {
    void validate(String token);
}
