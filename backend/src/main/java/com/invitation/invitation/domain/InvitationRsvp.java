package com.invitation.invitation.domain;

import java.time.Instant;
import java.util.UUID;

public record InvitationRsvp(UUID id, UUID invitationId, String guestName,
        String guestNameNormalized, int guestCount, boolean attending, String message,
        Instant createdAt) { }
