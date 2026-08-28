package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.invitation.domain.Invitation;
import com.invitation.invitation.domain.InvitationViewMode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;

@Service
public class UpdateInvitationService implements UpdateInvitationUseCase {

    private final InvitationRepository invitations;
    private final InvitationTemplateCatalog templates;
    private final OwnedInvitationFinder finder;
    private final Clock clock;

    public UpdateInvitationService(
            InvitationRepository invitations,
            InvitationTemplateCatalog templates,
            OwnedInvitationFinder finder,
            Clock clock
    ) {
        this.invitations = invitations;
        this.templates = templates;
        this.finder = finder;
        this.clock = clock;
    }

    @Override
    @Transactional
    public UpdatedInvitation update(
            String publicSlug,
            UpdateInvitationCommand command,
            AuthenticatedUser principal
    ) {
        Invitation current = finder.find(publicSlug, principal);

        String templateId = templates.requireAvailable(command.templateId());

        if (command.eventDate() == null || command.eventDate().isBefore(LocalDate.now(clock))) {
            throw new IllegalArgumentException("eventDate cannot be in the past");
        }

        Invitation updated = current.update(
                templateId,
                command.viewMode() == null ? InvitationViewMode.SCROLL : command.viewMode(),
                command.eventType(),
                command.eventName(),
                command.honoreeName(),
                command.honoreeAge(),
                command.eventDate(),
                command.eventTime(),
                command.venueName(),
                command.address(),
                command.mapsUrl(),
                command.heroImageUrl(),
                command.galleryImageUrls(),
                command.message(),
                command.sectionBackgrounds(),
                command.contactInfo(),
                command.shareTitle(),
                command.shareDescription(),
                command.shareImageUrl(),
                command.dateChangeNoticeEnabled(),
                clock.instant()
        );

        Invitation saved = invitations.save(updated);
        String metadataVersion = Long.toString(saved.updatedAt().toEpochMilli());

        return new UpdatedInvitation(
                saved.publicSlug(),
                "/i/" + saved.publicSlug() + "?v=" + metadataVersion,
                saved.status(),
                saved.eventName(),
                metadataVersion
        );
    }
}
