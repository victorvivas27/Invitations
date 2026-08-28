package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.invitation.domain.Invitation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetOwnedInvitationService implements GetOwnedInvitationUseCase {

    private final OwnedInvitationFinder finder;

    public GetOwnedInvitationService(OwnedInvitationFinder finder) {
        this.finder = finder;
    }

    @Override
    @Transactional(readOnly = true)
    public OwnedInvitationDetail get(String publicSlug, AuthenticatedUser principal) {

        Invitation invitation = finder.find(publicSlug, principal);

        return new OwnedInvitationDetail(
                invitation.id(),
                invitation.publicSlug(),
                "/i/" + invitation.publicSlug(),
                invitation.templateId(),
                invitation.viewMode(),
                invitation.eventType(),
                invitation.eventName(),
                invitation.honoreeName(),
                invitation.honoreeAge(),
                invitation.eventDate(),
                invitation.eventTime(),
                invitation.venueName(),
                invitation.address(),
                invitation.mapsUrl(),
                invitation.heroImageUrl(),
                invitation.galleryImageUrls(),
                invitation.message(),
                invitation.sectionBackgrounds(),
                invitation.contactInfo(),
                invitation.shareTitle(),
                invitation.shareDescription(),
                invitation.shareImageUrl(),
                invitation.dateChangeNoticeEnabled(),
                invitation.status(),
                invitation.createdAt(),
                invitation.updatedAt()
        );
    }
}
