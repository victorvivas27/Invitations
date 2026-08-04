package com.invitation.auth.application.port;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.auth.domain.IssuedToken;

@FunctionalInterface
public interface TokenGenerator {
    IssuedToken generate(AuthenticatedUser user);
}
