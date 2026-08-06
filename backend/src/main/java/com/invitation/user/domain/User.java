package com.invitation.user.domain;

import java.time.Instant;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * User domain entity and owner of future invitations.
 */
public final class User {

    private static final int NAME_MAX_LENGTH = 100;
    private static final int EMAIL_MAX_LENGTH = 254;
    private static final int PASSWORD_HASH_MAX_LENGTH = 255;
    private static final Pattern PUBLIC_CODE_PATTERN = Pattern.compile("ACC-[A-Z0-9]{12}");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private final UUID id;
    private final String publicCode;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String passwordHash;
    private final UserStatus status;
    private final Instant createdAt;
    private final Instant updatedAt;
    private final UUID createdBy;
    private final UUID updatedBy;

    private User(UserData data) {
        id = Objects.requireNonNull(data.id(), "id is required");
        publicCode = requirePublicCode(data.publicCode());
        firstName = requireText(data.firstName(), "firstName", NAME_MAX_LENGTH);
        lastName = requireText(data.lastName(), "lastName", NAME_MAX_LENGTH);
        email = requireEmail(data.email());
        passwordHash = requirePasswordHash(data.passwordHash(), data.status());
        status = Objects.requireNonNull(data.status(), "status is required");
        createdAt = Objects.requireNonNull(data.createdAt(), "createdAt is required");
        updatedAt = Objects.requireNonNull(data.updatedAt(), "updatedAt is required");
        createdBy = Objects.requireNonNull(data.createdBy(), "createdBy is required");
        updatedBy = Objects.requireNonNull(data.updatedBy(), "updatedBy is required");
        if (updatedAt.isBefore(createdAt)) {
            throw new IllegalArgumentException("updatedAt cannot precede createdAt");
        }
    }

    public static User create(UUID id, String publicCode, String firstName, String lastName,
                              String email, String passwordHash, UUID actorId, Instant now) {
        return new User(new UserData(id, publicCode, firstName, lastName, email, passwordHash,
                UserStatus.ACTIVE, now, now, actorId, actorId));
    }

    public static User restore(UserData data) {
        return new User(data);
    }

    public static User createPending(UUID id, String publicCode, String firstName, String lastName,
                                     String email, UUID actorId, Instant now) {
        return new User(new UserData(id, publicCode, firstName, lastName, email, null,
                UserStatus.PENDING_ACTIVATION, now, now, actorId, actorId));
    }

    private static String requirePasswordHash(String value, UserStatus userStatus) {
        if (userStatus == UserStatus.PENDING_ACTIVATION && value == null) {
            return null;
        }
        return requireText(value, "passwordHash", PASSWORD_HASH_MAX_LENGTH);
    }

    private static String requirePublicCode(String value) {
        String normalized = requireText(value, "publicCode", 16).toUpperCase(Locale.ROOT);
        if (!PUBLIC_CODE_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("publicCode must match ACC-XXXXXXXXXXXX");
        }
        return normalized;
    }

    private static String requireEmail(String value) {
        String normalized = requireText(value, "email", EMAIL_MAX_LENGTH).toLowerCase(Locale.ROOT);
        if (!EMAIL_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("email must be valid");
        }
        return normalized;
    }

    private static String requireText(String value, String field, int maxLength) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " is required");
        }
        String trimmed = value.trim();
        if (trimmed.length() > maxLength) {
            throw new IllegalArgumentException(field + " exceeds " + maxLength + " characters");
        }
        return trimmed;
    }

    public User activate(String newPasswordHash, Instant now) {
        if (status != UserStatus.PENDING_ACTIVATION) {
            throw new IllegalStateException("Only pending users can be activated");
        }
        return new User(new UserData(id, publicCode, firstName, lastName, email, newPasswordHash,
                UserStatus.ACTIVE, createdAt, now, createdBy, id));
    }

    public UUID getId() {
        return id;
    }

    public String getPublicCode() {
        return publicCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public UserStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public UUID getUpdatedBy() {
        return updatedBy;
    }

    /**
     * Complete state used only to restore a persisted domain entity.
     */
    public record UserData(UUID id, String publicCode, String firstName, String lastName,
                           String email, String passwordHash, UserStatus status, Instant createdAt,
                           Instant updatedAt, UUID createdBy, UUID updatedBy) {
    }
}
