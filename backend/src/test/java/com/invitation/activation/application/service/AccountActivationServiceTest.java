package com.invitation.activation.application.service;

import com.invitation.activation.application.ActivationTokenGoneException;
import com.invitation.activation.application.ActivationTokenMalformedException;
import com.invitation.activation.application.ActivationTokenNotFoundException;
import com.invitation.activation.application.port.ActivationTokenHasher;
import com.invitation.activation.application.port.ActivationTokenRepository;
import com.invitation.activation.domain.AccountActivationToken;
import com.invitation.user.application.InvalidPasswordException;
import com.invitation.user.application.port.PasswordHasher;
import com.invitation.user.domain.User;
import com.invitation.user.domain.UserStatus;
import com.invitation.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AccountActivationServiceTest {
    private static final Instant NOW = Instant.parse("2026-07-31T17:00:00Z");
    private static final String RAW = "A".repeat(42) + "1";
    private static final String HASH = "a".repeat(64);
    private final UUID userId = UUID.randomUUID();
    @Mock
    private ActivationTokenRepository tokens;
    @Mock
    private ActivationTokenHasher hasher;
    @Mock
    private UserRepository users;
    @Mock
    private PasswordHasher passwords;
    private AccountActivationService service;

    private static Class<?> thrown(Runnable action) {
        try {
            action.run();
            return Void.class;
        } catch (RuntimeException exception) {
            return exception.getClass();
        }
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new AccountActivationService(tokens, hasher, users, passwords,
                Clock.fixed(NOW, ZoneOffset.UTC));
        when(hasher.hash(RAW)).thenReturn(HASH);
    }

    @Test
    void validatesAnActiveToken() {
        when(tokens.findByHash(HASH)).thenReturn(Optional.of(token(NOW.plusSeconds(60), null)));
        service.validate(RAW);
        assertThat(true).isTrue();
    }

    @Test
    void distinguishesMalformedMissingExpiredAndUsedTokens() {
        when(tokens.findByHash(HASH)).thenReturn(Optional.empty());
        assertThat(new Class<?>[]{
                thrown(() -> service.validate("bad")),
                thrown(() -> service.validate(RAW)),
                thrownFor(token(NOW.minusSeconds(1), null)),
                thrownFor(token(NOW.plusSeconds(60), NOW.minusSeconds(1)))
        }).containsExactly(ActivationTokenMalformedException.class,
                ActivationTokenNotFoundException.class, ActivationTokenGoneException.class,
                ActivationTokenGoneException.class);
    }

    @Test
    void completesOnceAndActivatesTheUserWithAHash() {
        AccountActivationToken token = token(NOW.plusSeconds(60), null);
        User pending = User.createPending(userId, "ACC-ABC123DEF456", "María", "Pérez",
                "maria@example.com", userId, NOW.minusSeconds(60));
        AtomicReference<User> saved = new AtomicReference<>();
        when(tokens.findByHash(HASH)).thenReturn(Optional.of(token));
        when(users.findById(userId)).thenReturn(Optional.of(pending));
        when(passwords.hash("Password1")).thenReturn("stored-hash");
        when(users.save(any())).thenAnswer(call -> {
            saved.set(call.getArgument(0));
            return saved.get();
        });

        service.complete(RAW, "Password1");

        assertThat(new Object[]{saved.get().getStatus(), saved.get().getPasswordHash()})
                .containsExactly(UserStatus.ACTIVE, "stored-hash");
    }

    @Test
    void rejectsInvalidPasswordBeforeUsingToken() {
        assertThatThrownBy(() -> service.complete(RAW, "password"))
                .isInstanceOf(InvalidPasswordException.class);
    }

    private Class<?> thrownFor(AccountActivationToken value) {
        when(tokens.findByHash(HASH)).thenReturn(Optional.of(value));
        return thrown(() -> service.validate(RAW));
    }

    private AccountActivationToken token(Instant expires, Instant used) {
        return new AccountActivationToken(UUID.randomUUID(), userId, HASH, expires, NOW, used);
    }
}
