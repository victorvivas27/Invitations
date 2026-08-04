package com.invitation.activation.infrastructure.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface SpringDataActivationTokenRepository extends JpaRepository<ActivationTokenJpaEntity, UUID> {
    Optional<ActivationTokenJpaEntity> findByTokenHash(String tokenHash);
    void deleteByUserId(UUID userId);
}
