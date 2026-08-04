package com.invitation.auth.application;

public record LoginResult(String token, String tokenType, long expiresIn, PublicUser user) { }
