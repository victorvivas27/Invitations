package com.invitation.activation.application.port;
import com.invitation.activation.application.CreatePendingUserCommand;
import com.invitation.activation.application.PendingUserResult;
@FunctionalInterface
public interface CreatePendingUserUseCase {
    PendingUserResult create(CreatePendingUserCommand command);
}
