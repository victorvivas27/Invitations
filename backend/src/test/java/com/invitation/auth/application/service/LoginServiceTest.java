package com.invitation.auth.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.invitation.auth.application.InvalidCredentialsException;
import com.invitation.auth.application.LoginCommand;
import com.invitation.auth.application.LoginResult;
import com.invitation.auth.application.port.TokenGenerator;
import com.invitation.auth.domain.IssuedToken;
import com.invitation.user.application.port.PasswordHasher;
import com.invitation.user.domain.User;
import com.invitation.user.domain.User.UserData;
import com.invitation.user.domain.UserStatus;
import com.invitation.user.repository.UserRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class LoginServiceTest {
    private static final String EMAIL = "ana@example.com";
    private static final String HASH = "stored-hash";
    private static final String PASSWORD = "Password1";
    private User user;
    @Mock private UserRepository repository;
    @Mock private PasswordHasher hasher;
    @Mock private TokenGenerator tokens;
    private LoginService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new LoginService(repository, hasher, tokens);
        UUID id = UUID.randomUUID();
        Instant now = Instant.parse("2026-07-31T17:00:00Z");
        user = User.create(id, "ACC-ABC123DEF456", "Ana", "Pérez", EMAIL, HASH, id, now);
    }

    @Test
    void logsInWithNormalizedEmailAndPublicResponse() {
        when(repository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(hasher.matches(PASSWORD, HASH)).thenReturn(true);
        when(tokens.generate(org.mockito.ArgumentMatchers.any())).thenReturn(new IssuedToken("jwt", 3600));

        LoginResult result = service.login(new LoginCommand(" ANA@Example.COM ", PASSWORD));

        assertThat(new Object[] {result.token(), result.tokenType(), result.expiresIn(),
            result.user().code(), result.user().email(), result.user().status()})
                .containsExactly("jwt", "Bearer", 3600L, "ACC-ABC123DEF456", EMAIL, UserStatus.ACTIVE);
    }

    @Test
    void rejectsUnknownUserWithGenericMessage() {
        when(repository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertInvalidCredentials();
    }

    @Test
    void rejectsWrongPasswordWithGenericMessage() {
        when(repository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(hasher.matches(PASSWORD, HASH)).thenReturn(false);

        assertInvalidCredentials();
    }

    @Test
    void rejectsInactiveUserWithGenericMessage() {
        UserData data = new UserData(user.getId(), user.getPublicCode(), user.getFirstName(),
                user.getLastName(), user.getEmail(), user.getPasswordHash(), UserStatus.SUSPENDED,
                user.getCreatedAt(), user.getUpdatedAt(), user.getCreatedBy(), user.getUpdatedBy());
        when(repository.findByEmail(EMAIL)).thenReturn(Optional.of(User.restore(data)));

        assertInvalidCredentials();
    }

    private void assertInvalidCredentials() {
        assertThatThrownBy(() -> service.login(new LoginCommand(EMAIL, PASSWORD)))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid email or password");
    }
}
