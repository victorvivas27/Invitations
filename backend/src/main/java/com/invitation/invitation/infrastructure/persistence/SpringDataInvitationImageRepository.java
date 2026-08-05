package com.invitation.invitation.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataInvitationImageRepository extends JpaRepository<InvitationImageJpaEntity, UUID> {
    Optional<InvitationImageJpaEntity> findByImageUrlAndOwnerId(String imageUrl, UUID ownerId);
    List<InvitationImageJpaEntity> findAllByInvitationId(UUID invitationId);
    long countByInvitationIdAndImageContext(UUID invitationId, String imageContext);
}
