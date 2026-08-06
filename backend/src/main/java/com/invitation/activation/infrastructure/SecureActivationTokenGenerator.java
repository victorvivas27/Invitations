package com.invitation.activation.infrastructure;

import com.invitation.activation.application.port.ActivationTokenGenerator;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;

@Component
public class SecureActivationTokenGenerator implements ActivationTokenGenerator {
    private static final int TOKEN_BYTES = 32;
    private final SecureRandom random = new SecureRandom();

    @Override
    public String generate() {
        byte[] bytes = new byte[TOKEN_BYTES];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
