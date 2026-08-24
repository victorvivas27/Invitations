package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.invitation.domain.Invitation;
import com.invitation.invitation.domain.InvitationStatus;
import com.invitation.user.domain.User;
import com.invitation.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class CreateInvitationService implements CreateInvitationUseCase {
    private static final int MAX_SLUG_ATTEMPTS = 8;
    private final InvitationRepository invitations;
    private final UserRepository users;
    private final InvitationTemplateCatalog templates;
    private final PublicSlugGenerator slugGenerator;
    private final Clock clock;

    public CreateInvitationService(InvitationRepository invitations, UserRepository users,
                                   InvitationTemplateCatalog templates, PublicSlugGenerator slugGenerator, Clock clock) {
        this.invitations = invitations;
        this.users = users;
        this.templates = templates;
        this.slugGenerator = slugGenerator;
        this.clock = clock;
    }

    @Override
    @Transactional
    public CreatedInvitation create(CreateInvitationCommand command, AuthenticatedUser principal) {
        if (principal == null) throw new AuthenticationCredentialsNotFoundException("Authentication required");
        User owner = users.findByPublicCode(principal.code())
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("User not found"));
        String templateId = templates.requireAvailable(command.templateId());
        if (command.eventDate() == null || command.eventDate().isBefore(LocalDate.now(clock))) {
            throw new IllegalArgumentException("eventDate cannot be in the past");
        }
        String slug = uniqueSlug(command.eventName());
        var now = clock.instant();
        Invitation invitation = new Invitation(command.invitationId() == null ? UUID.randomUUID() : command.invitationId(), slug, owner.getId(), templateId, command.viewMode() == null ? com.invitation.invitation.domain.InvitationViewMode.SCROLL : command.viewMode(),
                command.eventType(), command.eventName(), command.honoreeName(), command.honoreeAge(),
                command.eventDate(), command.eventTime(), command.venueName(), command.address(),
                command.mapsUrl(), command.heroImageUrl(), command.galleryImageUrls(), command.message(), command.sectionBackgrounds(), command.contactInfo(),
                command.shareTitle(), command.shareDescription(), command.shareImageUrl(),
                InvitationStatus.PUBLISHED, now, now);
        Invitation saved = invitations.save(invitation);
        String metadataVersion = Long.toString(saved.updatedAt().toEpochMilli());
        return new CreatedInvitation(saved.publicSlug(),
                "/i/" + saved.publicSlug() + "?v=" + metadataVersion,
                saved.status(), saved.eventName(), metadataVersion);
    }

    private String uniqueSlug(String eventName) {
        for (int attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
            String candidate = slugGenerator.generate(eventName == null ? "invitacion" : eventName);
            if (!invitations.existsByPublicSlug(candidate)) return candidate;
        }
        throw new IllegalStateException("Could not generate a unique public slug");
    }
}
