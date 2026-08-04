package com.invitation.invitation.infrastructure.persistence;

import com.invitation.invitation.domain.InvitationStatus;
import java.util.Optional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataInvitationRepository extends JpaRepository<InvitationJpaEntity, UUID> {
    boolean existsByPublicSlug(String publicSlug);
    Optional<InvitationJpaEntity> findByPublicSlugAndStatus(String publicSlug, InvitationStatus status);
    Optional<InvitationJpaEntity> findByPublicSlug(String publicSlug);
    List<InvitationJpaEntity> findAllByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}
