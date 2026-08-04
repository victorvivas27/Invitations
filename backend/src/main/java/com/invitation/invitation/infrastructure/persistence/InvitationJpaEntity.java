package com.invitation.invitation.infrastructure.persistence;

import com.invitation.invitation.domain.EventType;
import com.invitation.invitation.domain.InvitationStatus;
import com.invitation.invitation.domain.InvitationViewMode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "invitations")
public class InvitationJpaEntity {
    @Id private UUID id;
    @Column(name = "public_slug", nullable = false, unique = true, length = 180) private String publicSlug;
    @Column(name = "owner_id", nullable = false) private UUID ownerId;
    @Column(name = "template_id", nullable = false, length = 80) private String templateId;
    @Enumerated(EnumType.STRING) @Column(name = "view_mode", nullable = false, length = 20) private InvitationViewMode viewMode;
    @Enumerated(EnumType.STRING) @Column(name = "event_type", nullable = false, length = 40) private EventType eventType;
    @Column(name = "event_name", nullable = false, length = 120) private String eventName;
    @Column(name = "honoree_name", nullable = false, length = 100) private String honoreeName;
    @Column(name = "honoree_age") private Integer honoreeAge;
    @Column(name = "event_date", nullable = false) private LocalDate eventDate;
    @Column(name = "event_time", nullable = false) private LocalTime eventTime;
    @Column(name = "venue_name", nullable = false, length = 150) private String venueName;
    @Column(nullable = false, length = 250) private String address;
    @Column(name = "maps_url", length = 500) private String mapsUrl;
    @Column(name = "hero_image_url", length = 500) private String heroImageUrl;
    @Column(name = "gallery_image_urls", columnDefinition = "TEXT") private String galleryImageUrls;
    @Column(nullable = false, length = 1000) private String message;
    @Column(name = "section_backgrounds", columnDefinition = "TEXT") private String sectionBackgrounds;
    @Column(name = "contact_info", columnDefinition = "TEXT") private String contactInfo;
    @Column(name = "share_title", length = 120) private String shareTitle;
    @Column(name = "share_description", length = 200) private String shareDescription;
    @Column(name = "share_image_url", length = 500) private String shareImageUrl;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 32) private InvitationStatus status;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    protected InvitationJpaEntity() { }
    public InvitationJpaEntity(UUID id, String publicSlug, UUID ownerId, String templateId,
            InvitationViewMode viewMode, EventType eventType, String eventName, String honoreeName, Integer honoreeAge,
            LocalDate eventDate, LocalTime eventTime, String venueName, String address,
            String mapsUrl, String heroImageUrl, String galleryImageUrls, String message, String sectionBackgrounds, String contactInfo,
            String shareTitle, String shareDescription, String shareImageUrl,
            InvitationStatus status, Instant createdAt, Instant updatedAt) {
        this.id = id; this.publicSlug = publicSlug; this.ownerId = ownerId; this.templateId = templateId;
        this.viewMode = viewMode; this.eventType = eventType; this.eventName = eventName; this.honoreeName = honoreeName;
        this.honoreeAge = honoreeAge; this.eventDate = eventDate; this.eventTime = eventTime;
        this.venueName = venueName; this.address = address; this.mapsUrl = mapsUrl;
        this.heroImageUrl = heroImageUrl; this.galleryImageUrls = galleryImageUrls; this.message = message;
        this.sectionBackgrounds = sectionBackgrounds;
        this.contactInfo = contactInfo;
        this.shareTitle = shareTitle; this.shareDescription = shareDescription; this.shareImageUrl = shareImageUrl;
        this.status = status; this.createdAt = createdAt; this.updatedAt = updatedAt;
    }
    public UUID getId() { return id; } public String getPublicSlug() { return publicSlug; }
    public UUID getOwnerId() { return ownerId; } public String getTemplateId() { return templateId; }
    public EventType getEventType() { return eventType; } public String getEventName() { return eventName; }
    public InvitationViewMode getViewMode() { return viewMode; }
    public String getHonoreeName() { return honoreeName; } public Integer getHonoreeAge() { return honoreeAge; }
    public LocalDate getEventDate() { return eventDate; } public LocalTime getEventTime() { return eventTime; }
    public String getVenueName() { return venueName; } public String getAddress() { return address; }
    public String getMapsUrl() { return mapsUrl; }
    public String getHeroImageUrl() { return heroImageUrl; }
    public String getGalleryImageUrls() { return galleryImageUrls; }
    public String getMessage() { return message; } public InvitationStatus getStatus() { return status; }
    public String getSectionBackgrounds() { return sectionBackgrounds; }
    public String getContactInfo() { return contactInfo; }
    public String getShareTitle() { return shareTitle; }
    public String getShareDescription() { return shareDescription; }
    public String getShareImageUrl() { return shareImageUrl; }
    public Instant getCreatedAt() { return createdAt; } public Instant getUpdatedAt() { return updatedAt; }
}
