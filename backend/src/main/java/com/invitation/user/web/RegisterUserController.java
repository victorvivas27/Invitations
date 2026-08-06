package com.invitation.user.web;

import com.invitation.user.application.RegisterUserCommand;
import com.invitation.user.application.RegisteredUser;
import com.invitation.user.application.port.RegisterUserUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class RegisterUserController {

    private final RegisterUserUseCase useCase;

    public RegisterUserController(RegisterUserUseCase useCase) {
        this.useCase = useCase;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterUserResponse register(@Valid @RequestBody RegisterUserRequest request) {
        RegisteredUser user = useCase.register(new RegisterUserCommand(request.firstName(),
                request.lastName(), request.email(), request.password()));
        return new RegisterUserResponse(user.code(), user.firstName(), user.lastName(),
                user.email(), user.status(), user.createdAt());
    }
}
