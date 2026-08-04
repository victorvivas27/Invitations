package com.invitation.invitation.application;

public class DuplicateInvitationGuestException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public DuplicateInvitationGuestException() {
        super("This guest has already confirmed attendance");
    }
}
