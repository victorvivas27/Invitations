package com.invitation.user.application.port;

import com.invitation.user.application.RegisterUserCommand;
import com.invitation.user.application.RegisteredUser;

/**
 * Inbound port for account registration.
 */
@FunctionalInterface
public interface RegisterUserUseCase {

    RegisteredUser register(RegisterUserCommand command);
}
