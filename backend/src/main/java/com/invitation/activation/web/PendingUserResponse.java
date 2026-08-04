package com.invitation.activation.web;
import com.invitation.user.domain.UserStatus;
public record PendingUserResponse(String code, String name, String email, UserStatus status) { }
