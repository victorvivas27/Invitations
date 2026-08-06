package com.invitation.invitation.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "invitation_images")
public class InvitationImageJpaEntity {
    @Id
    private UUID id;
    @Column(name = "invitation_id", nullable = false)
    private UUID invitationId;
    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;
    @Column(name = "image_url", nullable = false, unique = true, length = 1000)
    private String imageUrl;
    @Column(name = "image_public_id", nullable = false, unique = true, length = 500)
    private String imagePublicId;
    @Column(name = "image_format", nullable = false, length = 20)
    private String imageFormat;
    @Column(name = "image_width", nullable = false)
    private int imageWidth;
    @Column(name = "image_height", nullable = false)
    private int imageHeight;
    @Column(name = "image_bytes", nullable = false)
    private long imageBytes;
    @Column(name = "image_context", nullable = false, length = 20)
    private String imageContext;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected InvitationImageJpaEntity() {
    }

    public InvitationImageJpaEntity(UUID id, UUID invitationId, UUID ownerId, String imageUrl,
                                    String imagePublicId, String imageFormat, int imageWidth, int imageHeight,
                                    long imageBytes, String imageContext, Instant createdAt) {
        this.id = id;
        this.invitationId = invitationId;
        this.ownerId = ownerId;
        this.imageUrl = imageUrl;
        this.imagePublicId = imagePublicId;
        this.imageFormat = imageFormat;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.imageBytes = imageBytes;
        this.imageContext = imageContext;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getInvitationId() {
        return invitationId;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getImagePublicId() {
        return imagePublicId;
    }
}
