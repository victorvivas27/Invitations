package com.invitation.invitation.application;

import com.invitation.invitation.domain.EventType;
import com.invitation.invitation.domain.InvitationViewMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record CreateInvitationCommand(String templateId, InvitationViewMode viewMode, EventType eventType, String eventName,
        String honoreeName, Integer honoreeAge, LocalDate eventDate, LocalTime eventTime,
        String venueName, String address, String mapsUrl, String heroImageUrl,
        List<String> galleryImageUrls, String message, String sectionBackgrounds, String contactInfo) { }
