package com.invitation.activation.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

interface SpringDataActivationTokenRepository extends JpaRepository<ActivationTokenJpaEntity, UUID> {
    Optional<ActivationTokenJpaEntity> findByTokenHash(String tokenHash);

    void deleteByUserId(UUID userId);
}
