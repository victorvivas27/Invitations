package com.invitation.user.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

interface SpringDataUserJpaRepository extends JpaRepository<UserJpaEntity, UUID> {

    boolean existsByEmail(String email);

    boolean existsByPublicCode(String publicCode);

    Optional<UserJpaEntity> findByEmail(String email);

    Optional<UserJpaEntity> findByPublicCode(String publicCode);
}
