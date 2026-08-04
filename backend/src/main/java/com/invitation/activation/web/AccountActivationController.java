package com.invitation.activation.web;

import com.invitation.activation.application.port.AccountActivationUseCase;
import com.invitation.activation.application.port.ValidateActivationTokenUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/account-activation")
public class AccountActivationController {
    private final ValidateActivationTokenUseCase validator;
    private final AccountActivationUseCase activator;

    public AccountActivationController(ValidateActivationTokenUseCase validator,
            AccountActivationUseCase activator) {
        this.validator = validator;
        this.activator = activator;
    }

    @GetMapping("/validate")
    public ActivationValidationResponse validate(@RequestParam String token) {
        validator.validate(token);
        return new ActivationValidationResponse(true);
    }

    @PostMapping("/complete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void complete(@Valid @RequestBody CompleteActivationRequest request) {
        activator.complete(request.token(), request.password());
    }
}
