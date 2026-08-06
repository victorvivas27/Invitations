package com.invitation.invitation.application;

import com.invitation.invitation.domain.EventType;
import com.invitation.invitation.domain.InvitationStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

public record OwnedInvitation(String publicSlug, String publicUrl, String templateId,
                              EventType eventType, String eventName, String honoreeName, LocalDate eventDate,
                              LocalTime eventTime, String venueName, InvitationStatus status, Instant createdAt) {
}
