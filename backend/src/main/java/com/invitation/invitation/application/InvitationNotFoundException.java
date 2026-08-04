package com.invitation.invitation.application;

public class InvitationNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public InvitationNotFoundException() { super("Invitation not found"); }
}
