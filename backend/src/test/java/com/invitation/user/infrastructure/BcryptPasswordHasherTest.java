package com.invitation.user.infrastructure;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class BcryptPasswordHasherTest {

    @Test
    void hashesWithoutPersistingTheRawPassword() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(4);
        BcryptPasswordHasher hasher = new BcryptPasswordHasher(encoder);

        String hash = hasher.hash("Password1");

        assertThat(new boolean[] {"Password1".equals(hash), hasher.matches("Password1", hash)})
                .containsExactly(false, true);
    }
}
