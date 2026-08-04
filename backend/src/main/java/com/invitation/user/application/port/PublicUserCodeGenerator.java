package com.invitation.user.application.port;

/** Generates opaque account codes that are independent from internal identifiers. */
@FunctionalInterface
public interface PublicUserCodeGenerator {

    String generate();
}
