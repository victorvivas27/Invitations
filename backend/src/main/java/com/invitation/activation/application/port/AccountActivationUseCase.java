package com.invitation.activation.application.port;

@FunctionalInterface
public interface AccountActivationUseCase {
    void complete(String token, String password);
}
