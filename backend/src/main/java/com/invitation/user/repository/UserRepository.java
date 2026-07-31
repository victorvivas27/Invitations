package com.invitation.user.repository;

import com.invitation.user.domain.User;
import java.util.Optional;
import java.util.UUID;

/** Persistence port for users. */
public interface UserRepository {

    User save(User user);

    Optional<User> findById(UUID id);

    boolean existsByEmail(String email);

    boolean existsByPublicCode(String publicCode);
}
