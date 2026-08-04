package com.invitation.invitation.application;

import com.invitation.invitation.domain.Invitation;
import com.invitation.invitation.domain.InvitationRsvp;
import java.time.Clock;
import java.util.UUID;
import java.text.Normalizer;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void confirm(String publicSlug, String firstName, String lastName, int guestCount,
            boolean attending, String message) {
        Invitation invitation = invitations.findPublishedByPublicSlug(publicSlug)
                .orElseThrow(InvitationNotFoundException::new);
        String guestName = firstName.trim() + " " + lastName.trim();
        String normalizedName = normalize(guestName);
        if (rsvps.existsByInvitationIdAndGuestNameNormalized(invitation.id(), normalizedName)) {
            throw new DuplicateInvitationGuestException();
        }
        String normalizedMessage = message == null || message.isBlank() ? null : message.trim();
        rsvps.save(new InvitationRsvp(UUID.randomUUID(), invitation.id(), guestName,
                normalizedName, guestCount, attending, normalizedMessage, clock.instant()));
    }

    private static String normalize(String value) {
        String withoutAccents = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "");
        return withoutAccents.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT);
    }
}
