package com.invitation.user.persistence;

import java.util.UUID;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

interface SpringDataUserJpaRepository extends JpaRepository<UserJpaEntity, UUID> {

    boolean existsByEmail(String email);

    boolean existsByPublicCode(String publicCode);

    Optional<UserJpaEntity> findByEmail(String email);

    Optional<UserJpaEntity> findByPublicCode(String publicCode);
}
