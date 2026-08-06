package com.invitation.invitation.application;

import com.invitation.invitation.domain.InvitationRsvp;

import java.util.List;
import java.util.UUID;

public interface InvitationRsvpRepository {
    void save(InvitationRsvp rsvp);

    boolean existsByInvitationIdAndGuestNameNormalized(UUID invitationId, String normalizedName);

    List<InvitationRsvp> findAllByInvitationId(UUID invitationId);
}
