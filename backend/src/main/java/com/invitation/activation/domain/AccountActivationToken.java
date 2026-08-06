package com.invitation.activation.domain;

import java.time.Instant;
import java.util.UUID;

public record AccountActivationToken(UUID id, UUID userId, String tokenHash, Instant expiresAt,
                                     Instant createdAt, Instant usedAt) {

    public boolean isExpired(Instant now) {
        return !expiresAt.isAfter(now);
    }

    public boolean isUsed() {
        return usedAt != null;
    }

    public AccountActivationToken markUsed(Instant now) {
        return new AccountActivationToken(id, userId, tokenHash, expiresAt, createdAt, now);
    }
}
