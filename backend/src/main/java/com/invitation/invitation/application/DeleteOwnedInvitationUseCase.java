package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;

@FunctionalInterface
public interface DeleteOwnedInvitationUseCase {
    void delete(String publicSlug, AuthenticatedUser authenticatedUser);
}
