package com.invitation.invitation.application;

import com.invitation.invitation.domain.Invitation;
import com.invitation.invitation.domain.InvitationRsvp;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.Clock;
import java.util.Locale;
import java.util.UUID;

@Service
public class ConfirmAttendanceService {
    private final InvitationRepository invitations;
    private final InvitationRsvpRepository rsvps;
    private final Clock clock;

    public ConfirmAttendanceService(InvitationRepository invitations,
                                    InvitationRsvpRepository rsvps, Clock clock) {
        this.invitations = invitations;
        this.rsvps = rsvps;
        this.clock = clock;
    }

    private static String normalize(String value) {
        String withoutAccents = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "");
        return withoutAccents.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT);
    }

    @Transactional
    public void confirm(String publicSlug, String firstName, String lastName, int guestCount,
                        boolean attending, String message) {
        Invitation invitation = invitations.findPublishedByPublicSlug(publicSlug)
                .orElseThrow(InvitationNotFoundException::new);
        String guestName = firstName.trim() + " " + lastName.trim();
        String normalizedName = normalize(guestName);
        String normalizedMessage = message == null || message.isBlank() ? null : message.trim();
        UUID responseId = rsvps.findByInvitationIdAndGuestNameNormalized(invitation.id(), normalizedName)
                .map(InvitationRsvp::id)
                .orElseGet(UUID::randomUUID);
        rsvps.save(new InvitationRsvp(responseId, invitation.id(), guestName,
                normalizedName, guestCount, attending, normalizedMessage, clock.instant()));
    }
}
