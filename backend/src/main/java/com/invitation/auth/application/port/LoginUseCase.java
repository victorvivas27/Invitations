package com.invitation.auth.application.port;

import com.invitation.auth.application.LoginCommand;
import com.invitation.auth.application.LoginResult;

@FunctionalInterface
public interface LoginUseCase {
    LoginResult login(LoginCommand command);
}
