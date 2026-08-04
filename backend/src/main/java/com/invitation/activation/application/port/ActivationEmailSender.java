package com.invitation.activation.application.port;

@FunctionalInterface
public interface ActivationEmailSender {
    void send(String recipientName, String recipientEmail, String activationUrl, long expiresInSeconds);
}
