package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;

@FunctionalInterface
public interface CreateInvitationUseCase {
    CreatedInvitation create(CreateInvitationCommand command, AuthenticatedUser authenticatedUser);
}
