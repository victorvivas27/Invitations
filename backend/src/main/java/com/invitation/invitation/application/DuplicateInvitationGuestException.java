package com.invitation.invitation.application;

import java.io.Serial;

public class DuplicateInvitationGuestException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public DuplicateInvitationGuestException() {
        super("This guest has already confirmed attendance");
    }
}
