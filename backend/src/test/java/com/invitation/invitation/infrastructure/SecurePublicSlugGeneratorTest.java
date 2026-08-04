package com.invitation.invitation.infrastructure;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

@SuppressWarnings({"PMD.UnitTestContainsTooManyAsserts", "PMD.UnitTestAssertionsShouldIncludeMessage"})
class SecurePublicSlugGeneratorTest {
    private final SecurePublicSlugGenerator generator = new SecurePublicSlugGenerator();

    @Test
    void normalizesVisibleNameAndAddsRandomUrlSafeEntropy() {
        String first = generator.generate("  Cumpleaños de Sofía & Álex!!!  ");
        String second = generator.generate("Cumpleaños de Sofía & Álex!!!");
        assertTrue(first.matches("cumpleanos-de-sofia-alex-[a-z0-9]{8}"));
        assertNotEquals(first, second);
    }
}
