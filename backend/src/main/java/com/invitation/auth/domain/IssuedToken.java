package com.invitation.auth.domain;

public record IssuedToken(String value, long expiresIn) { }
