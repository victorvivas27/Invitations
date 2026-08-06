package com.invitation.user.persistence;

import com.invitation.user.domain.User;
import com.invitation.user.mapper.UserPersistenceMapper;
import com.invitation.user.repository.DuplicateUserException;
import com.invitation.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@Import({JpaUserRepository.class, UserPersistenceMapper.class})
class JpaUserRepositoryTest {

    private static final UUID ACTOR_ID = UUID.fromString("2a9ad07c-e738-4af1-90fd-ad251e68144f");
    private static final Instant NOW = Instant.parse("2026-07-31T17:00:00Z");
    private static final String EMAIL = "ana@example.com";

    @Autowired
    private UserRepository repository;

    private static User user(String publicCode, String email) {
        return User.create(UUID.randomUUID(), publicCode, "Ana", "Vivas", email,
                "hashed-password", ACTOR_ID, NOW);
    }

    @Test
    void persistsAndFindsAUser() {
        User original = user("ACC-ABC123DEF456", EMAIL);

        User saved = repository.save(original);

        assertThat(repository.findById(saved.getId()).orElseThrow())
                .usingRecursiveComparison()
                .isEqualTo(original);
    }

    @Test
    void findsUsersByNormalizedUniqueFields() {
        repository.save(user("ACC-ABC123DEF456", EMAIL));

        assertThat(new boolean[]{
                repository.existsByEmail(" ANA@EXAMPLE.COM "),
                repository.existsByPublicCode(" acc-abc123def456 ")
        }).containsExactly(true, true);
    }

    @Test
    void rejectsDuplicateEmail() {
        repository.save(user("ACC-ABC123DEF456", EMAIL));

        User duplicate = user("ACC-ZYX987WVU654", EMAIL);

        assertThatThrownBy(() -> repository.save(duplicate))
                .isInstanceOf(DuplicateUserException.class)
                .hasMessage("A unique user value already exists");
    }
}
