package com.invitation.invitation.application;

import com.invitation.invitation.domain.InvitationStatus;

public record CreatedInvitation(String publicSlug, String publicUrl, InvitationStatus status,
        String eventName) { }
