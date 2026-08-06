package com.invitation.invitation.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataInvitationImageRepository extends JpaRepository<InvitationImageJpaEntity, UUID> {
    Optional<InvitationImageJpaEntity> findByImageUrlAndOwnerId(String imageUrl, UUID ownerId);

    List<InvitationImageJpaEntity> findAllByInvitationId(UUID invitationId);

    long countByInvitationIdAndImageContext(UUID invitationId, String imageContext);
}
