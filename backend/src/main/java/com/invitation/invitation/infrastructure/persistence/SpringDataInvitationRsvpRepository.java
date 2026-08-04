package com.invitation.invitation.infrastructure.persistence;

import java.util.UUID;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataInvitationRsvpRepository
        extends JpaRepository<InvitationRsvpJpaEntity, UUID> {
    boolean existsByInvitationIdAndGuestNameNormalized(UUID invitationId, String normalizedName);
    List<InvitationRsvpJpaEntity> findAllByInvitationIdOrderByCreatedAtDesc(UUID invitationId);
}
