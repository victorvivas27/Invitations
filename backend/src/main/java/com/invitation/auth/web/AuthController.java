package com.invitation.auth.web;

import com.invitation.auth.application.LoginCommand;
import com.invitation.auth.application.LoginResult;
import com.invitation.auth.application.PublicUser;
import com.invitation.auth.application.port.CurrentUserUseCase;
import com.invitation.auth.application.port.LoginUseCase;
import com.invitation.auth.domain.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final LoginUseCase loginUseCase;
    private final CurrentUserUseCase currentUserUseCase;

    public AuthController(LoginUseCase loginUseCase, CurrentUserUseCase currentUserUseCase) {
        this.loginUseCase = loginUseCase;
        this.currentUserUseCase = currentUserUseCase;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        LoginResult result = loginUseCase.login(new LoginCommand(request.email(), request.password()));
        return new LoginResponse(result.token(), result.tokenType(), result.expiresIn(), result.user());
    }

    @GetMapping("/me")
    public PublicUser me(@AuthenticationPrincipal AuthenticatedUser principal) {
        return currentUserUseCase.find(principal);
    }
}
