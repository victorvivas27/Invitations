package com.invitation.invitation.application;

@FunctionalInterface
public interface GetPublicInvitationUseCase {
    PublicInvitation get(String publicSlug);
}
