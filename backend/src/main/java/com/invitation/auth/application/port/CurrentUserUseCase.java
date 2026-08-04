package com.invitation.auth.application.port;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.auth.application.PublicUser;

@FunctionalInterface
public interface CurrentUserUseCase {
    PublicUser find(AuthenticatedUser principal);
}
