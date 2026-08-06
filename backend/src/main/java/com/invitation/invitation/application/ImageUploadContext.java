package com.invitation.invitation.application;

import java.util.UUID;

public record ImageUploadContext(UUID invitationId, ImageKind kind) {
    public ImageUploadContext {
        if (invitationId == null) throw new IllegalArgumentException("invitationId is required");
        if (kind == null) throw new IllegalArgumentException("image kind is required");
    }

    public enum ImageKind {COVER, GALLERY, DECORATION, SOCIAL}
}
