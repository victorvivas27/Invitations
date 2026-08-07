package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;

@FunctionalInterface
public interface GetOwnedInvitationUseCase {

    OwnedInvitationDetail get(String publicSlug, AuthenticatedUser principal);

}
