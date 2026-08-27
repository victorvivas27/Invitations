package com.invitation.invitation.application;

import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class InvitationTemplateCatalog {
    private static final Set<String> AVAILABLE = Set.of("birthday-heroes-ready", "birthday-urban", "birthday-colorful",
            "baptism-sky", "baptism-classic", "wedding-elegant", "wedding-minimal",
            "baby-shower-modern", "kids-heroes", "kids-adventure", "graduation-modern");
    private static final Set<String> UPCOMING = Set.of("anniversary-night", "blank-canvas");

    public String requireAvailable(String templateId) {
        if (templateId == null) throw new IllegalArgumentException("templateId is required");
        String normalized = templateId.trim().toLowerCase(java.util.Locale.ROOT);
        if (UPCOMING.contains(normalized)) throw new IllegalArgumentException("Template is not available yet");
        if (!AVAILABLE.contains(normalized)) throw new IllegalArgumentException("Unknown template");
        return normalized;
    }
}
