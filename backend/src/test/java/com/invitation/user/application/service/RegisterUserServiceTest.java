package com.invitation.user.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.invitation.user.application.DuplicateEmailException;
import com.invitation.user.application.InvalidPasswordException;
import com.invitation.user.application.RegisterUserCommand;
import com.invitation.user.application.RegisteredUser;
import com.invitation.user.application.port.PasswordHasher;
import com.invitation.user.application.port.PublicUserCodeGenerator;
import com.invitation.user.domain.User;
import com.invitation.user.domain.UserStatus;
import com.invitation.user.repository.UserRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class RegisterUserServiceTest {

    private static final Instant NOW = Instant.parse("2026-07-31T17:00:00Z");
    private static final String CODE = "ACC-ABC123DEF456";
    private static final String RAW_PASSWORD = "Password1";
    private static final String PASSWORD_HASH = "$2a$12$secure-hash";
    private static final String EMAIL = "ana@example.com";

    @Mock
    private UserRepository repository;
    @Mock
    private PasswordHasher passwordHasher;
    @Mock
    private PublicUserCodeGenerator codeGenerator;
    private RegisterUserService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        Clock clock = Clock.fixed(NOW, ZoneOffset.UTC);
        service = new RegisterUserService(repository, passwordHasher, codeGenerator, clock);
    }

    @Test
    void registersWithNormalizedEmailHashAndInitialStatus() {
        when(codeGenerator.generate()).thenReturn(CODE);
        when(passwordHasher.hash(RAW_PASSWORD)).thenReturn(PASSWORD_HASH);
        AtomicReference<User> persistedReference = new AtomicReference<>();
        when(repository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            persistedReference.set(user);
            return user;
        });

        RegisteredUser result = service.register(command(" ANA@Example.COM ", RAW_PASSWORD));
        User persisted = persistedReference.get();

        assertThat(new Object[] {result.email(), result.status(), result.createdAt(),
            persisted.getEmail(), persisted.getPasswordHash(), persisted.getStatus()})
                .containsExactly("ana@example.com", UserStatus.ACTIVE, NOW,
                        "ana@example.com", PASSWORD_HASH, UserStatus.ACTIVE);
    }

    @Test
    void rejectsDuplicateNormalizedEmailWithoutHashing() {
        when(repository.existsByEmail(EMAIL)).thenReturn(true);

        assertThatThrownBy(() -> service.register(command(" ANA@Example.COM ", RAW_PASSWORD)))
                .isInstanceOf(DuplicateEmailException.class)
                .hasMessage("An account with this email already exists");
    }

    @ParameterizedTest
    @ValueSource(strings = {"short1", "password", "12345678"})
    void rejectsPasswordsOutsideTheInitialPolicy(String password) {
        assertThatThrownBy(() -> service.register(command(EMAIL, password)))
                .isInstanceOf(InvalidPasswordException.class);
    }

    private static RegisterUserCommand command(String email, String password) {
        return new RegisterUserCommand("Ana", "Pérez", email, password);
    }
}
