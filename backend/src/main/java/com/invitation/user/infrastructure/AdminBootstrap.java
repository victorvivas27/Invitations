package com.invitation.user.infrastructure;

import com.invitation.user.application.port.PasswordHasher;
import com.invitation.user.application.port.PublicUserCodeGenerator;
import com.invitation.user.domain.User;
import com.invitation.user.domain.UserRole;
import com.invitation.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Component
public class AdminBootstrap implements ApplicationRunner {
    private final UserRepository users;
    private final PasswordHasher passwords;
    private final PublicUserCodeGenerator codes;
    private final Clock clock;
    private final String email;
    private final String initialPassword;

    public AdminBootstrap(UserRepository users, PasswordHasher passwords,
                          PublicUserCodeGenerator codes, Clock clock,
                          @Value("${app.admin-email:}") String email,
                          @Value("${app.admin-initial-password:}") String initialPassword) {
        this.users = users;
        this.passwords = passwords;
        this.codes = codes;
        this.clock = clock;
        this.email = email.trim().toLowerCase(Locale.ROOT);
        this.initialPassword = initialPassword;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments arguments) {
        if (email.isBlank()) return;
        Instant now = clock.instant();
        var existing = users.findByEmail(email);
        if (existing.isPresent()) {
            User user = existing.orElseThrow();
            if (user.getRole() != UserRole.ADMIN) {
                users.save(user.withRole(UserRole.ADMIN, user.getId(), now));
            }
            return;
        }
        if (initialPassword.isBlank()) return;
        if (initialPassword.length() < 12) {
            throw new IllegalStateException(
                    "ADMIN_INITIAL_PASSWORD must contain at least 12 characters");
        }
        UUID id = UUID.randomUUID();
        users.save(User.create(id, uniqueCode(), "Victor Javier", "Vivas", email,
                passwords.hash(initialPassword), id, now, UserRole.ADMIN));
    }

    private String uniqueCode() {
        for (int attempt = 0; attempt < 10; attempt++) {
            String code = codes.generate();
            if (!users.existsByPublicCode(code)) return code;
        }
        throw new IllegalStateException("Unable to allocate the administrator account code");
    }
}
