package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;
import java.util.List;

@FunctionalInterface
public interface ListOwnedInvitationsUseCase {
    List<OwnedInvitation> list(AuthenticatedUser authenticatedUser);
}
