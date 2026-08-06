package com.invitation.auth.web;

import com.invitation.auth.application.PublicUser;

public record LoginResponse(String token, String tokenType, long expiresIn, PublicUser user) {
}
