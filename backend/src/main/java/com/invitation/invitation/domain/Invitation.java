package com.invitation.invitation.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;
import java.util.UUID;
import java.util.List;

public record Invitation(UUID id, String publicSlug, UUID ownerId, String templateId,
        InvitationViewMode viewMode, EventType eventType, String eventName, String honoreeName, Integer honoreeAge,
        LocalDate eventDate, LocalTime eventTime, String venueName, String address,
        String mapsUrl, String heroImageUrl, List<String> galleryImageUrls, String message, String sectionBackgrounds, String contactInfo,
        InvitationStatus status, Instant createdAt, Instant updatedAt) {

    public Invitation {
        Objects.requireNonNull(id, "id is required");
        publicSlug = text(publicSlug, "publicSlug", 180);
        Objects.requireNonNull(ownerId, "ownerId is required");
        templateId = text(templateId, "templateId", 80);
        Objects.requireNonNull(viewMode, "viewMode is required");
        Objects.requireNonNull(eventType, "eventType is required");
        eventName = text(eventName, "eventName", 120);
        honoreeName = text(honoreeName, "honoreeName", 100);
        if (honoreeAge != null && (honoreeAge < 0 || honoreeAge > 150)) {
            throw new IllegalArgumentException("honoreeAge must be between 0 and 150");
        }
        Objects.requireNonNull(eventDate, "eventDate is required");
        Objects.requireNonNull(eventTime, "eventTime is required");
        venueName = text(venueName, "venueName", 150);
        address = text(address, "address", 250);
        mapsUrl = optionalText(mapsUrl, "mapsUrl", 500);
        heroImageUrl = optionalText(heroImageUrl, "heroImageUrl", 500);
        galleryImageUrls = galleryImageUrls == null ? List.of() : galleryImageUrls.stream()
                .map(value -> optionalText(value, "galleryImageUrl", 500)).limit(6).toList();
        message = text(message, "message", 1000);
        sectionBackgrounds = optionalJson(sectionBackgrounds);
        contactInfo = optionalJson(contactInfo, "contactInfo", 3000);
        Objects.requireNonNull(status, "status is required");
        Objects.requireNonNull(createdAt, "createdAt is required");
        Objects.requireNonNull(updatedAt, "updatedAt is required");
    }

    private static String text(String value, String field, int maximum) {
        if (value == null || value.isBlank()) throw new IllegalArgumentException(field + " is required");
        String normalized = value.trim();
        if (normalized.length() > maximum) throw new IllegalArgumentException(field + " is too long");
        return normalized;
    }

    private static String optionalText(String value, String field, int maximum) {
        if (value == null || value.isBlank()) return null;
        String normalized = value.trim();
        if (normalized.length() > maximum) throw new IllegalArgumentException(field + " is too long");
        if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
            throw new IllegalArgumentException(field + " must be a valid HTTP URL");
        }
        return normalized;
    }

    private static String optionalJson(String value) {
        return optionalJson(value, "sectionBackgrounds", 12000);
    }

    private static String optionalJson(String value, String field, int maximum) {
        if (value == null || value.isBlank()) return null;
        String normalized = value.trim();
        if (normalized.length() > maximum || !normalized.startsWith("{") || !normalized.endsWith("}")) {
            throw new IllegalArgumentException(field + " must be a JSON object");
        }
        return normalized;
    }
}
