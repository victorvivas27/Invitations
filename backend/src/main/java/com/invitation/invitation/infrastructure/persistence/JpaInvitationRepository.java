package com.invitation.invitation.infrastructure.persistence;

import com.invitation.invitation.application.InvitationRepository;
import com.invitation.invitation.domain.Invitation;
import com.invitation.invitation.domain.InvitationStatus;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public class JpaInvitationRepository implements InvitationRepository {
    private final SpringDataInvitationRepository repository;
    public JpaInvitationRepository(SpringDataInvitationRepository repository) { this.repository = repository; }

    @Override public Invitation save(Invitation invitation) { return toDomain(repository.saveAndFlush(toEntity(invitation))); }
    @Override public boolean existsByPublicSlug(String slug) { return repository.existsByPublicSlug(slug); }
    @Override public Optional<Invitation> findPublishedByPublicSlug(String slug) {
        return repository.findByPublicSlugAndStatus(slug, InvitationStatus.PUBLISHED).map(this::toDomain);
    }
    @Override public Optional<Invitation> findByPublicSlug(String slug) {
        return repository.findByPublicSlug(slug).map(this::toDomain);
    }
    @Override public List<Invitation> findAllByOwnerId(UUID ownerId) {
        return repository.findAllByOwnerIdOrderByCreatedAtDesc(ownerId).stream().map(this::toDomain).toList();
    }
    @Override public void delete(Invitation invitation) { repository.deleteById(invitation.id()); }
    private InvitationJpaEntity toEntity(Invitation value) {
        return new InvitationJpaEntity(value.id(), value.publicSlug(), value.ownerId(), value.templateId(), value.viewMode(),
                value.eventType(), value.eventName(), value.honoreeName(), value.honoreeAge(),
                value.eventDate(), value.eventTime(), value.venueName(), value.address(), value.mapsUrl(),
                value.heroImageUrl(), String.join("\n", value.galleryImageUrls()), value.message(), value.sectionBackgrounds(), value.contactInfo(),
                value.shareTitle(), value.shareDescription(), value.shareImageUrl(),
                value.status(), value.createdAt(), value.updatedAt());
    }
    private Invitation toDomain(InvitationJpaEntity value) {
        return new Invitation(value.getId(), value.getPublicSlug(), value.getOwnerId(), value.getTemplateId(), value.getViewMode(),
                value.getEventType(), value.getEventName(), value.getHonoreeName(), value.getHonoreeAge(),
                value.getEventDate(), value.getEventTime(), value.getVenueName(), value.getAddress(),
                value.getMapsUrl(), value.getHeroImageUrl(), splitImages(value.getGalleryImageUrls()),
                value.getMessage(), value.getSectionBackgrounds(), value.getContactInfo(), value.getShareTitle(), value.getShareDescription(), value.getShareImageUrl(),
                value.getStatus(), value.getCreatedAt(), value.getUpdatedAt());
    }
    private static List<String> splitImages(String value) {
        return value == null || value.isBlank() ? List.of() : Arrays.stream(value.split("\\n"))
                .filter(item -> !item.isBlank()).toList();
    }
}
