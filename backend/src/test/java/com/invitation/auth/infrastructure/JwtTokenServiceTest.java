package com.invitation.auth.infrastructure;

import static org.assertj.core.api.Assertions.assertThat;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.auth.domain.IssuedToken;
import com.invitation.user.domain.UserStatus;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

class JwtTokenServiceTest {
    private static final String SECRET = "test-only-secret-with-at-least-32-characters";
    private static final String ISSUER = "https://test.invitation.local";
    private static final String CODE = "ACC-ABC123DEF456";
    private static final String EMAIL = "ana@example.com";
    private static final Instant NOW = Instant.now().truncatedTo(ChronoUnit.SECONDS);
    private JwtTokenService service;
    private JwtDecoder decoder;

    @BeforeEach
    void setUp() {
        JwtProperties properties = new JwtProperties(SECRET, 3600, ISSUER);
        JwtConfig config = new JwtConfig();
        SecretKey key = new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        decoder = config.jwtDecoder(key, properties);
        service = new JwtTokenService(config.jwtEncoder(key), decoder, properties,
                Clock.fixed(NOW, ZoneOffset.UTC));
    }

    @Test
    void generatesExpectedClaimsIssuerAndExpiration() {
        IssuedToken token = service.generate(new AuthenticatedUser(CODE, EMAIL, UserStatus.ACTIVE));

        Jwt jwt = decoder.decode(token.value());

        assertThat(new Object[] {jwt.getSubject(), jwt.getIssuer().toString(),
            jwt.getClaimAsString("email"), jwt.getClaimAsString("status"),
            jwt.getIssuedAt(), jwt.getExpiresAt(), token.expiresIn()})
                .containsExactly(CODE, ISSUER, EMAIL,
                        "ACTIVE", NOW, NOW.plusSeconds(3600), 3600L);
    }

    @Test
    void validatesAGenuineToken() {
        IssuedToken token = service.generate(new AuthenticatedUser(CODE, EMAIL, UserStatus.ACTIVE));

        assertThat(service.validate(token.value())).isPresent();
    }

    @Test
    void rejectsMalformedAndInvalidSignatureTokens() {
        assertThat(new boolean[] {service.validate("malformed").isEmpty(),
            service.validate(validTokenWithOtherSecret()).isEmpty()}).containsExactly(true, true);
    }

    @Test
    void rejectsExpiredToken() {
        JwtProperties properties = new JwtProperties(SECRET, 1, ISSUER);
        JwtConfig config = new JwtConfig();
        SecretKey key = new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        JwtTokenService expiredIssuer = new JwtTokenService(config.jwtEncoder(key), decoder, properties,
                Clock.fixed(Instant.now().minusSeconds(120), ZoneOffset.UTC));
        String expired = expiredIssuer.generate(new AuthenticatedUser(CODE, EMAIL, UserStatus.ACTIVE)).value();

        assertThat(service.validate(expired)).isEmpty();
    }

    private String validTokenWithOtherSecret() {
        String other = "another-test-secret-with-at-least-32-characters";
        SecretKey key = new SecretKeySpec(other.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        JwtProperties properties = new JwtProperties(other, 3600, ISSUER);
        JwtTokenService otherService = new JwtTokenService(new JwtConfig().jwtEncoder(key), decoder,
                properties, Clock.fixed(NOW, ZoneOffset.UTC));
        return otherService.generate(new AuthenticatedUser(CODE, EMAIL, UserStatus.ACTIVE)).value();
    }
}
