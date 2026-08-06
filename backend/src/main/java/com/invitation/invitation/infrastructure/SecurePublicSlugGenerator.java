package com.invitation.invitation.infrastructure;

import com.invitation.invitation.application.PublicSlugGenerator;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.text.Normalizer;
import java.util.Locale;

@Component
public class SecurePublicSlugGenerator implements PublicSlugGenerator {
    private static final String ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final int SUFFIX_LENGTH = 8;
    private static final int BASE_MAX_LENGTH = 160;
    private final SecureRandom random = new SecureRandom();

    @Override
    public String generate(String eventName) {
        String base = Normalizer.normalize(eventName.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "").toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
        if (base.isBlank()) base = "invitacion";
        if (base.length() > BASE_MAX_LENGTH) {
            base = base.substring(0, BASE_MAX_LENGTH).replaceAll("-+$", "");
        }
        StringBuilder suffix = new StringBuilder(SUFFIX_LENGTH);
        for (int index = 0; index < SUFFIX_LENGTH; index++) {
            suffix.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }
        return base + "-" + suffix;
    }
}
