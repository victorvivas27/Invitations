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

import java.util.UUID;

@Service
public class DeleteInvitationGuestService {
    private final InvitationRepository invitations;
    private final InvitationRsvpRepository rsvps;
    private final UserRepository users;

    public DeleteInvitationGuestService(InvitationRepository invitations,
                                        InvitationRsvpRepository rsvps, UserRepository users) {
        this.invitations = invitations;
        this.rsvps = rsvps;
        this.users = users;
    }

    @Transactional
    public void delete(String publicSlug, UUID guestId, AuthenticatedUser principal) {
        if (principal == null) throw new AuthenticationCredentialsNotFoundException("Authentication required");
        User owner = users.findByPublicCode(principal.code())
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("User not found"));
        Invitation invitation = invitations.findByPublicSlug(publicSlug)
                .orElseThrow(InvitationNotFoundException::new);
        if (!invitation.ownerId().equals(owner.getId()))
            throw new AccessDeniedException("Invitation belongs to another user");
        InvitationRsvp guest = rsvps.findById(guestId)
                .filter(value -> value.invitationId().equals(invitation.id()))
                .orElseThrow(InvitationNotFoundException::new);
        rsvps.deleteById(guest.id());
    }
}
