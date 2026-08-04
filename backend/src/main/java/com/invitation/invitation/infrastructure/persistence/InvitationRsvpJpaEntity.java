package com.invitation.invitation.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "invitation_rsvps")
public class InvitationRsvpJpaEntity {
    @Id private UUID id;
    @Column(name = "invitation_id", nullable = false) private UUID invitationId;
    @Column(name = "guest_name", nullable = false, length = 120) private String guestName;
    @Column(name = "guest_name_normalized", nullable = false, length = 120) private String guestNameNormalized;
    @Column(name = "guest_count", nullable = false) private int guestCount;
    @Column(nullable = false) private boolean attending;
    @Column(length = 500) private String message;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    protected InvitationRsvpJpaEntity() { }
    public InvitationRsvpJpaEntity(UUID id, UUID invitationId, String guestName,
            String guestNameNormalized, int guestCount, boolean attending, String message,
            Instant createdAt) {
        this.id = id; this.invitationId = invitationId; this.guestName = guestName;
        this.guestNameNormalized = guestNameNormalized; this.guestCount = guestCount;
        this.attending = attending; this.message = message;
        this.createdAt = createdAt;
    }
    public UUID getId() { return id; } public UUID getInvitationId() { return invitationId; }
    public String getGuestName() { return guestName; }
    public String getGuestNameNormalized() { return guestNameNormalized; }
    public int getGuestCount() { return guestCount; } public boolean isAttending() { return attending; }
    public String getMessage() { return message; } public Instant getCreatedAt() { return createdAt; }
}
