package com.invitation.auth.application.port;

import com.invitation.auth.application.PublicUser;
import com.invitation.auth.domain.AuthenticatedUser;

@FunctionalInterface
public interface CurrentUserUseCase {
    PublicUser find(AuthenticatedUser principal);
}
