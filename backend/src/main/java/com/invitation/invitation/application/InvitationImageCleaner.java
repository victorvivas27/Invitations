package com.invitation.invitation.application;

import com.invitation.invitation.domain.Invitation;

@FunctionalInterface
public interface InvitationImageCleaner {
    void deleteImages(Invitation invitation);
}
