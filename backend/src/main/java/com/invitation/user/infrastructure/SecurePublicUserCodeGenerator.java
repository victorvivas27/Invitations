package com.invitation.user.infrastructure;

import com.invitation.user.application.port.PublicUserCodeGenerator;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class SecurePublicUserCodeGenerator implements PublicUserCodeGenerator {

    private static final char[] ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();
    private static final int RANDOM_LENGTH = 12;
    private final SecureRandom random = new SecureRandom();

    @Override
    public String generate() {
        StringBuilder code = new StringBuilder("ACC-");
        for (int index = 0; index < RANDOM_LENGTH; index++) {
            code.append(ALPHABET[random.nextInt(ALPHABET.length)]);
        }
        return code.toString();
    }
}
