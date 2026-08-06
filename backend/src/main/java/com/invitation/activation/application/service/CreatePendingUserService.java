package com.invitation.activation.application.service;

import com.invitation.activation.application.CreatePendingUserCommand;
import com.invitation.activation.application.PendingUserResult;
import com.invitation.activation.application.port.*;
import com.invitation.activation.domain.AccountActivationToken;
import com.invitation.activation.infrastructure.ActivationProperties;
import com.invitation.auth.application.InvalidCredentialsException;
import com.invitation.user.application.DuplicateEmailException;
import com.invitation.user.application.port.PublicUserCodeGenerator;
import com.invitation.user.domain.User;
import com.invitation.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Service
public class CreatePendingUserService implements CreatePendingUserUseCase {
    private final UserRepository users;
    private final ActivationTokenRepository tokens;
    private final PublicUserCodeGenerator codeGenerator;
    private final ActivationTokenGenerator tokenGenerator;
    private final ActivationTokenHasher tokenHasher;
    private final ActivationEmailSender emailSender;
    private final ActivationProperties properties;
    private final Clock clock;

    public CreatePendingUserService(UserRepository users, ActivationTokenRepository tokens,
                                    PublicUserCodeGenerator codeGenerator, ActivationTokenGenerator tokenGenerator,
                                    ActivationTokenHasher tokenHasher, ActivationEmailSender emailSender,
                                    ActivationProperties properties, Clock clock) {
        this.users = users;
        this.tokens = tokens;
        this.codeGenerator = codeGenerator;
        this.tokenGenerator = tokenGenerator;
        this.tokenHasher = tokenHasher;
        this.emailSender = emailSender;
        this.properties = properties;
        this.clock = clock;
    }

    private static String[] splitName(String fullName) {
        String normalized = fullName.trim().replaceAll("\\s+", " ");
        int separator = normalized.indexOf(' ');
        if (separator < 1 || separator == normalized.length() - 1) {
            throw new IllegalArgumentException("name must include first name and last name");
        }
        return new String[]{normalized.substring(0, separator), normalized.substring(separator + 1)};
    }

    @Override
    @Transactional
    public PendingUserResult create(CreatePendingUserCommand command) {
        String email = command.email().trim().toLowerCase(Locale.ROOT);
        if (users.existsByEmail(email)) {
            throw new DuplicateEmailException();
        }
        User actor = users.findByPublicCode(command.actorCode())
                .orElseThrow(InvalidCredentialsException::new);
        String[] names = splitName(command.name());
        Instant now = clock.instant();
        User pending = User.createPending(UUID.randomUUID(), uniqueCode(), names[0], names[1],
                email, actor.getId(), now);
        pending = users.save(pending);
        String rawToken = tokenGenerator.generate();
        tokens.deleteByUserId(pending.getId());
        tokens.save(new AccountActivationToken(UUID.randomUUID(), pending.getId(),
                tokenHasher.hash(rawToken), now.plusSeconds(
                properties.accountActivationExpirationSeconds()), now, null));
        String url = frontendBaseUrl() + "/activate-account?token=" + rawToken;
        emailSender.send(command.name().trim(), email, url,
                properties.accountActivationExpirationSeconds());
        return new PendingUserResult(pending.getPublicCode(), command.name().trim(), email,
                pending.getStatus());
    }

    private String uniqueCode() {
        for (int attempt = 0; attempt < 10; attempt++) {
            String code = codeGenerator.generate();
            if (!users.existsByPublicCode(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Unable to allocate a public account code");
    }

    private String frontendBaseUrl() {
        String url = properties.frontendUrl();
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}
