package com.invitation.invitation.application;

import java.io.Serial;

public class InvitationNotFoundException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public InvitationNotFoundException() {
        super("Invitation not found");
    }
}
