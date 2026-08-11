package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.invitation.domain.Invitation;
import com.invitation.invitation.domain.InvitationRsvp;
import com.invitation.user.domain.User;
import com.invitation.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;

@Service
public class UpdateInvitationGuestService {
    private final InvitationRepository invitations;
    private final InvitationRsvpRepository rsvps;
    private final UserRepository users;

    public UpdateInvitationGuestService(InvitationRepository invitations,
                                        InvitationRsvpRepository rsvps, UserRepository users) {
        this.invitations = invitations;
        this.rsvps = rsvps;
        this.users = users;
    }

    @Transactional
    public InvitationGuest update(String publicSlug, UUID guestId, String name, int guestCount,
                                  boolean attending, String message, AuthenticatedUser principal) {
        if (principal == null) throw new AuthenticationCredentialsNotFoundException("Authentication required");
        User owner = users.findByPublicCode(principal.code())
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("User not found"));
        Invitation invitation = invitations.findByPublicSlug(publicSlug)
                .orElseThrow(InvitationNotFoundException::new);
        if (!invitation.ownerId().equals(owner.getId()))
            throw new AccessDeniedException("Invitation belongs to another user");
        InvitationRsvp current = rsvps.findById(guestId)
                .filter(value -> value.invitationId().equals(invitation.id()))
                .orElseThrow(InvitationNotFoundException::new);
        String trimmedName = name.trim().replaceAll("\\s+", " ");
        String normalizedName = normalize(trimmedName);
        if (rsvps.existsByInvitationIdAndGuestNameNormalizedAndIdNot(
                invitation.id(), normalizedName, guestId)) throw new DuplicateInvitationGuestException();
        String normalizedMessage = message == null || message.isBlank() ? null : message.trim();
        InvitationRsvp updated = new InvitationRsvp(current.id(), current.invitationId(), trimmedName,
                normalizedName, attending ? guestCount : 1, attending, normalizedMessage, current.createdAt());
        rsvps.save(updated);
        return new InvitationGuest(updated.id(), updated.guestName(), updated.guestCount(),
                updated.attending(), updated.message(), updated.createdAt());
    }

    private static String normalize(String value) {
        return Normalizer.normalize(value, Normalizer.Form.NFD).replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT);
    }
}
