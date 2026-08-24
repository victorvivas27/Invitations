package com.invitation.invitation.application;

import com.invitation.invitation.domain.Invitation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetPublicInvitationService implements GetPublicInvitationUseCase {
    private final InvitationRepository repository;

    public GetPublicInvitationService(InvitationRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public PublicInvitation get(String publicSlug) {
        Invitation invitation = repository.findPublishedByPublicSlug(publicSlug)
                .orElseThrow(InvitationNotFoundException::new);
        return new PublicInvitation(invitation.publicSlug(), invitation.templateId(), invitation.viewMode(),
                invitation.eventType(), invitation.eventName(), invitation.honoreeName(),
                invitation.honoreeAge(), invitation.eventDate(), invitation.eventTime(),
                invitation.venueName(), invitation.address(), invitation.mapsUrl(),
                invitation.heroImageUrl(), invitation.galleryImageUrls(), invitation.message(), invitation.sectionBackgrounds(), invitation.contactInfo(),
                invitation.shareTitle(), invitation.shareDescription(), invitation.shareImageUrl(),
                invitation.updatedAt());
    }
}
