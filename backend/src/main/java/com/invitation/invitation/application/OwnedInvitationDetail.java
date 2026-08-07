package com.invitation.invitation.application;

import com.invitation.invitation.domain.EventType;
import com.invitation.invitation.domain.InvitationStatus;
import com.invitation.invitation.domain.InvitationViewMode;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record OwnedInvitationDetail(
        UUID id,
        String publicSlug,
        String publicUrl,
        String templateId,
        InvitationViewMode viewMode,
        EventType eventType,
        String eventName,
        String honoreeName,
        Integer honoreeAge,
        LocalDate eventDate,
        LocalTime eventTime,
        String venueName,
        String address,
        String mapsUrl,
        String heroImageUrl,
        List<String> galleryImageUrls,
        String message,
        String sectionBackgrounds,
        String contactInfo,
        String shareTitle,
        String shareDescription,
        String shareImageUrl,
        InvitationStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}