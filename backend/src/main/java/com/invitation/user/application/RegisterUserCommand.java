package com.invitation.user.application;

/**
 * Input accepted by the registration use case.
 */
public record RegisterUserCommand(String firstName, String lastName, String email, String password) {
}
