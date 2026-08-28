package com.invitation.invitation.application;

import com.invitation.invitation.domain.InvitationRsvp;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvitationRsvpRepository {
    void save(InvitationRsvp rsvp);

    boolean existsByInvitationIdAndGuestNameNormalized(UUID invitationId, String normalizedName);

    Optional<InvitationRsvp> findByInvitationIdAndGuestNameNormalized(UUID invitationId, String normalizedName);

    boolean existsByInvitationIdAndGuestNameNormalizedAndIdNot(UUID invitationId, String normalizedName, UUID id);

    Optional<InvitationRsvp> findById(UUID id);

    List<InvitationRsvp> findAllByInvitationId(UUID invitationId);
}
