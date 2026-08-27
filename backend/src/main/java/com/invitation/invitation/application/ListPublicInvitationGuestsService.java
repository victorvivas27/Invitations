package com.invitation.invitation.application;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListPublicInvitationGuestsService {
    private final InvitationRepository invitations;
    private final InvitationRsvpRepository rsvps;

    public ListPublicInvitationGuestsService(InvitationRepository invitations,
                                             InvitationRsvpRepository rsvps) {
        this.invitations = invitations;
        this.rsvps = rsvps;
    }

    public List<PublicInvitationGuest> list(String publicSlug) {
        var invitation = invitations.findByPublicSlug(publicSlug)
                .filter(value -> "PUBLISHED".equals(value.status().name()))
                .orElseThrow(InvitationNotFoundException::new);

        return rsvps.findAllByInvitationId(invitation.id()).stream()
                .filter(value -> value.attending())
                .map(value -> new PublicInvitationGuest(value.guestName(), value.message()))
                .toList();
    }
}
