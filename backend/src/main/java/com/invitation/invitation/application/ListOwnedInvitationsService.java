package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.user.domain.User;
import com.invitation.user.repository.UserRepository;
import java.util.List;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListOwnedInvitationsService implements ListOwnedInvitationsUseCase {
    private final InvitationRepository invitations;
    private final UserRepository users;

    public ListOwnedInvitationsService(InvitationRepository invitations, UserRepository users) {
        this.invitations = invitations;
        this.users = users;
    }

    @Override
    @Transactional(readOnly = true)
    public List<OwnedInvitation> list(AuthenticatedUser principal) {
        if (principal == null) throw new AuthenticationCredentialsNotFoundException("Authentication required");
        User owner = users.findByPublicCode(principal.code())
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("User not found"));
        return invitations.findAllByOwnerId(owner.getId()).stream()
                .map(invitation -> new OwnedInvitation(invitation.publicSlug(),
                        "/i/" + invitation.publicSlug(), invitation.templateId(), invitation.eventType(),
                        invitation.eventName(), invitation.honoreeName(), invitation.eventDate(),
                        invitation.eventTime(), invitation.venueName(), invitation.status(),
                        invitation.createdAt()))
                .toList();
    }
}
