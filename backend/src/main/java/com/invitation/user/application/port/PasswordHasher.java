package com.invitation.user.application.port;

/** Outbound port that prevents application code from handling encoder details. */
public interface PasswordHasher {

    String hash(String rawPassword);

    boolean matches(String rawPassword, String encodedPassword);
}
