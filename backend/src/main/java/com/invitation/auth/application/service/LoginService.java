package com.invitation.auth.application.service;

import com.invitation.auth.application.InvalidCredentialsException;
import com.invitation.auth.application.LoginCommand;
import com.invitation.auth.application.LoginResult;
import com.invitation.auth.application.PublicUser;
import com.invitation.auth.application.port.LoginUseCase;
import com.invitation.auth.application.port.TokenGenerator;
import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.auth.domain.IssuedToken;
import com.invitation.user.application.port.PasswordHasher;
import com.invitation.user.domain.User;
import com.invitation.user.domain.UserStatus;
import com.invitation.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class LoginService implements LoginUseCase {
    private final UserRepository repository;
    private final PasswordHasher passwordHasher;
    private final TokenGenerator tokenGenerator;

    public LoginService(UserRepository repository, PasswordHasher passwordHasher,
                        TokenGenerator tokenGenerator) {
        this.repository = repository;
        this.passwordHasher = passwordHasher;
        this.tokenGenerator = tokenGenerator;
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResult login(LoginCommand command) {
        String email = command.email().trim().toLowerCase(Locale.ROOT);
        User user = repository.findByEmail(email).orElseThrow(InvalidCredentialsException::new);
        if (user.getStatus() != UserStatus.ACTIVE
                || !passwordHasher.matches(command.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        IssuedToken token = tokenGenerator.generate(new AuthenticatedUser(user.getPublicCode(),
                user.getEmail(), user.getStatus(), user.getRole()));
        PublicUser publicUser = new PublicUser(user.getPublicCode(), user.getFirstName(),
                user.getLastName(), user.getEmail(), user.getStatus(), user.getRole());
        return new LoginResult(token.value(), "Bearer", token.expiresIn(), publicUser);
    }
}
