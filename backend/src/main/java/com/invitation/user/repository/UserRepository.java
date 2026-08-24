package com.invitation.user.repository;

import com.invitation.user.domain.User;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

/**
 * Persistence port for users.
 */
public interface UserRepository {

    User save(User user);

    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    Optional<User> findByPublicCode(String publicCode);

    boolean existsByEmail(String email);

    boolean existsByPublicCode(String publicCode);

    List<User> findAll();
}
