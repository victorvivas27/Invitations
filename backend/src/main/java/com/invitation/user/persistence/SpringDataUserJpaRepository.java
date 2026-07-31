package com.invitation.user.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface SpringDataUserJpaRepository extends JpaRepository<UserJpaEntity, UUID> {

    boolean existsByEmail(String email);

    boolean existsByPublicCode(String publicCode);
}
