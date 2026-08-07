package com.invitation.invitation.application;



import com.invitation.auth.domain.AuthenticatedUser;

@FunctionalInterface
public interface UpdateInvitationUseCase {

    UpdatedInvitation update(
            String publicSlug,
            UpdateInvitationCommand command,
            AuthenticatedUser principal
    );

}
