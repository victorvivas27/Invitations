package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.invitation.domain.Invitation;
import com.invitation.user.domain.User;
import com.invitation.user.repository.UserRepository;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListInvitationGuestsService {
    private final InvitationRepository invitations;
    private final InvitationRsvpRepository rsvps;
    private final UserRepository users;
    public ListInvitationGuestsService(InvitationRepository invitations,
            InvitationRsvpRepository rsvps, UserRepository users) {
        this.invitations = invitations; this.rsvps = rsvps; this.users = users;
    }
    @Transactional(readOnly = true)
    public List<InvitationGuest> list(String publicSlug, AuthenticatedUser principal) {
        if (principal == null) throw new AuthenticationCredentialsNotFoundException("Authentication required");
        User owner = users.findByPublicCode(principal.code())
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("User not found"));
        Invitation invitation = invitations.findByPublicSlug(publicSlug)
                .orElseThrow(InvitationNotFoundException::new);
        if (!invitation.ownerId().equals(owner.getId())) throw new AccessDeniedException("Invitation belongs to another user");
        return rsvps.findAllByInvitationId(invitation.id()).stream()
                .map(value -> new InvitationGuest(value.guestName(), value.guestCount(),
                        value.attending(), value.message(), value.createdAt())).toList();
    }
}
