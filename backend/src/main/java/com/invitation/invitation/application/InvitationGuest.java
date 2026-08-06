package com.invitation.invitation.application;

import java.time.Instant;

public record InvitationGuest(String name, int guestCount, boolean attending,
                              String message, Instant respondedAt) {
}
