package com.invitation.invitation.application;

import com.invitation.invitation.domain.Invitation;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface InvitationRepository {
    Invitation save(Invitation invitation);
    boolean existsByPublicSlug(String publicSlug);
    Optional<Invitation> findPublishedByPublicSlug(String publicSlug);
    Optional<Invitation> findByPublicSlug(String publicSlug);
    List<Invitation> findAllByOwnerId(UUID ownerId);
    void delete(Invitation invitation);
}
