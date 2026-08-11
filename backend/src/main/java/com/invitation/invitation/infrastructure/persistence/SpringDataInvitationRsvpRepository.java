package com.invitation.invitation.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataInvitationRsvpRepository
        extends JpaRepository<InvitationRsvpJpaEntity, UUID> {
    boolean existsByInvitationIdAndGuestNameNormalized(UUID invitationId, String normalizedName);

    boolean existsByInvitationIdAndGuestNameNormalizedAndIdNot(UUID invitationId, String normalizedName, UUID id);

    List<InvitationRsvpJpaEntity> findAllByInvitationIdOrderByCreatedAtDesc(UUID invitationId);
}
