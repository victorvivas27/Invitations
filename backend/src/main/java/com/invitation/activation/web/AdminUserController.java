package com.invitation.activation.web;

import com.invitation.activation.application.CreatePendingUserCommand;
import com.invitation.activation.application.PendingUserResult;
import com.invitation.activation.application.port.CreatePendingUserUseCase;
import com.invitation.auth.domain.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final CreatePendingUserUseCase useCase;

    public AdminUserController(CreatePendingUserUseCase useCase) {
        this.useCase = useCase;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PendingUserResponse create(@Valid @RequestBody CreatePendingUserRequest request,
            @AuthenticationPrincipal AuthenticatedUser principal) {
        PendingUserResult result = useCase.create(new CreatePendingUserCommand(request.name(),
                request.email(), principal.code()));
        return new PendingUserResponse(result.code(), result.name(), result.email(), result.status());
    }
}
