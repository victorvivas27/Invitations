package com.invitation.invitation.application;

import java.time.Instant;
import java.util.UUID;

public record InvitationGuest(UUID id, String name, int guestCount, boolean attending,
                              String message, Instant respondedAt) {
}
