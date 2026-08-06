package com.invitation.activation.infrastructure;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ActivationTokenSecurityTest {
    @Test
    void generatesUrlSafeRandomTokensAndStoresDeterministicHashes() {
        SecureActivationTokenGenerator generator = new SecureActivationTokenGenerator();
        Sha256ActivationTokenHasher hasher = new Sha256ActivationTokenHasher();
        String first = generator.generate();
        String second = generator.generate();
        String hash = hasher.hash(first);

        assertThat(new Object[]{first.length(), first.matches("[A-Za-z0-9_-]{43}"),
                first.equals(second), hash.length(), hash.equals(first), hasher.hash(first).equals(hash)})
                .containsExactly(43, true, false, 64, false, true);
    }
}
