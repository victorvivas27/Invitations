package com.invitation.activation.application.service;

import com.invitation.activation.application.ActivationTokenGoneException;
import com.invitation.activation.application.ActivationTokenMalformedException;
import com.invitation.activation.application.ActivationTokenNotFoundException;
import com.invitation.activation.application.port.AccountActivationUseCase;
import com.invitation.activation.application.port.ActivationTokenHasher;
import com.invitation.activation.application.port.ActivationTokenRepository;
import com.invitation.activation.application.port.ValidateActivationTokenUseCase;
import com.invitation.activation.domain.AccountActivationToken;
import com.invitation.user.application.InvalidPasswordException;
import com.invitation.user.application.port.PasswordHasher;
import com.invitation.user.domain.User;
import com.invitation.user.repository.UserRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountActivationService implements AccountActivationUseCase,
        ValidateActivationTokenUseCase {
    private static final Pattern TOKEN_PATTERN = Pattern.compile("[A-Za-z0-9_-]{43}");
    private final ActivationTokenRepository tokens;
    private final ActivationTokenHasher tokenHasher;
    private final UserRepository users;
    private final PasswordHasher passwordHasher;
    private final Clock clock;

    public AccountActivationService(ActivationTokenRepository tokens,
            ActivationTokenHasher tokenHasher, UserRepository users,
            PasswordHasher passwordHasher, Clock clock) {
        this.tokens = tokens;
        this.tokenHasher = tokenHasher;
        this.users = users;
        this.passwordHasher = passwordHasher;
        this.clock = clock;
    }

    @Override
    @Transactional(readOnly = true)
    public void validate(String token) {
        resolve(token);
    }

    @Override
    @Transactional
    public void complete(String token, String password) {
        validatePassword(password);
        AccountActivationToken activation = resolve(token);
        User user = users.findById(activation.userId())
                .orElseThrow(ActivationTokenNotFoundException::new);
        Instant now = clock.instant();
        users.save(user.activate(passwordHasher.hash(password), now));
        tokens.save(activation.markUsed(now));
    }

    private AccountActivationToken resolve(String rawToken) {
        if (rawToken == null || !TOKEN_PATTERN.matcher(rawToken).matches()) {
            throw new ActivationTokenMalformedException();
        }
        AccountActivationToken token = tokens.findByHash(tokenHasher.hash(rawToken))
                .orElseThrow(ActivationTokenNotFoundException::new);
        if (token.isUsed()) {
            throw new ActivationTokenGoneException("Activation token was already used");
        }
        if (token.isExpired(clock.instant())) {
            throw new ActivationTokenGoneException("Activation token has expired");
        }
        return token;
    }

    private static void validatePassword(String password) {
        if (password == null || password.length() < 8
                || password.chars().noneMatch(Character::isLetter)
                || password.chars().noneMatch(Character::isDigit)) {
            throw new InvalidPasswordException();
        }
    }
}
