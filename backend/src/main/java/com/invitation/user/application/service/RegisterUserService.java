package com.invitation.user.application.service;

import com.invitation.user.application.DuplicateEmailException;
import com.invitation.user.application.InvalidPasswordException;
import com.invitation.user.application.RegisterUserCommand;
import com.invitation.user.application.RegisteredUser;
import com.invitation.user.application.port.PasswordHasher;
import com.invitation.user.application.port.PublicUserCodeGenerator;
import com.invitation.user.application.port.RegisterUserUseCase;
import com.invitation.user.domain.User;
import com.invitation.user.repository.DuplicateUserException;
import com.invitation.user.repository.UserRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegisterUserService implements RegisterUserUseCase {

    private static final int MAX_CODE_GENERATION_ATTEMPTS = 10;

    private final UserRepository repository;
    private final PasswordHasher passwordHasher;
    private final PublicUserCodeGenerator codeGenerator;
    private final Clock clock;

    public RegisterUserService(UserRepository repository, PasswordHasher passwordHasher,
            PublicUserCodeGenerator codeGenerator, Clock clock) {
        this.repository = repository;
        this.passwordHasher = passwordHasher;
        this.codeGenerator = codeGenerator;
        this.clock = clock;
    }

    @Override
    @Transactional
    public RegisteredUser register(RegisterUserCommand command) {
        validatePassword(command.password());
        String normalizedEmail = command.email().trim().toLowerCase(Locale.ROOT);
        if (repository.existsByEmail(normalizedEmail)) {
            throw new DuplicateEmailException();
        }

        UUID id = UUID.randomUUID();
        Instant now = clock.instant();
        User user = User.create(id, nextUniqueCode(), command.firstName(), command.lastName(),
                normalizedEmail, passwordHasher.hash(command.password()), id, now);
        try {
            return toResult(repository.save(user));
        } catch (DuplicateUserException exception) {
            throw new DuplicateEmailException(exception);
        }
    }

    private String nextUniqueCode() {
        for (int attempt = 0; attempt < MAX_CODE_GENERATION_ATTEMPTS; attempt++) {
            String candidate = codeGenerator.generate();
            if (!repository.existsByPublicCode(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Unable to allocate a public account code");
    }

    private static void validatePassword(String password) {
        if (password == null || password.length() < 8
                || password.chars().noneMatch(Character::isLetter)
                || password.chars().noneMatch(Character::isDigit)) {
            throw new InvalidPasswordException();
        }
    }

    private static RegisteredUser toResult(User user) {
        return new RegisteredUser(user.getPublicCode(), user.getFirstName(), user.getLastName(),
                user.getEmail(), user.getStatus(), user.getCreatedAt());
    }
}
