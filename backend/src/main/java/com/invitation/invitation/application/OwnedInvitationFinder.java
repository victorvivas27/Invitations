package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.invitation.domain.Invitation;
import com.invitation.user.domain.User;
import com.invitation.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class OwnedInvitationFinder {

    private final InvitationRepository invitations;
    private final UserRepository users;

    public OwnedInvitationFinder(
            InvitationRepository invitations,
            UserRepository users
    ) {
        this.invitations = invitations;
        this.users = users;
    }

    public Invitation find(String publicSlug, AuthenticatedUser principal) {

        if (principal == null) {
            throw new AuthenticationCredentialsNotFoundException("Authentication required");
        }

        User owner = users.findByPublicCode(principal.code())
                .orElseThrow(() ->
                        new AuthenticationCredentialsNotFoundException("User not found"));

        Invitation invitation = invitations.findByPublicSlug(publicSlug)
                .orElseThrow(InvitationNotFoundException::new);

        if (!invitation.belongsTo(owner.getId())) {
            throw new AccessDeniedException("Invitation belongs to another user");
        }

        return invitation;
    }
}