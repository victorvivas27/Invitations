package com.invitation.user.domain;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserTest {

    private static final UUID USER_ID = UUID.fromString("04a0738a-82d8-45c6-a36d-1cd26d4cb5a1");
    private static final UUID ACTOR_ID = UUID.fromString("2a9ad07c-e738-4af1-90fd-ad251e68144f");
    private static final Instant NOW = Instant.parse("2026-07-31T17:00:00Z");
    private static final String LAST_NAME = "Vivas";

    @Test
    void createsAnActiveUserWithNormalizedValuesAndAuditData() {
        User user = User.create(USER_ID, "acc-ABC123DEF456", " Ana ", " Vivas ",
                " ANA@Example.COM ", "hashed-password", ACTOR_ID, NOW);

        assertThat(user)
                .extracting(User::getPublicCode, User::getFirstName, User::getLastName,
                        User::getEmail, User::getStatus, User::getCreatedAt, User::getUpdatedAt,
                        User::getCreatedBy, User::getUpdatedBy)
                .containsExactly("ACC-ABC123DEF456", "Ana", LAST_NAME, "ana@example.com",
                        UserStatus.ACTIVE, NOW, NOW, ACTOR_ID, ACTOR_ID);
    }

    @Test
    void rejectsMissingRequiredName() {
        assertThatThrownBy(() -> User.create(USER_ID, "ACC-ABC123DEF456", " ", LAST_NAME,
                "ana@example.com", "hash", ACTOR_ID, NOW))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("firstName is required");
    }

    @Test
    void rejectsInvalidEmail() {
        assertThatThrownBy(() -> User.create(USER_ID, "ACC-ABC123DEF456", "Ana", LAST_NAME,
                "invalid-email", "hash", ACTOR_ID, NOW))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("email must be valid");
    }

    @Test
    void rejectsInvalidPublicCode() {
        assertThatThrownBy(() -> User.create(USER_ID, "INV-ABC123DEF456", "Ana", LAST_NAME,
                "ana@example.com", "hash", ACTOR_ID, NOW))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("publicCode must match ACC-XXXXXXXXXXXX");
    }
}
