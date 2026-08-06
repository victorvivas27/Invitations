package com.invitation.invitation.web;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.invitation.application.ImageStorageService;
import com.invitation.invitation.application.ImageUploadContext;
import com.invitation.invitation.application.StoredImage;
import com.invitation.invitation.infrastructure.persistence.InvitationImageJpaEntity;
import com.invitation.invitation.infrastructure.persistence.SpringDataInvitationImageRepository;
import com.invitation.user.domain.User;
import com.invitation.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.time.Clock;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/invitation-images")
@SuppressWarnings("PMD.GuardLogStatement")
public class ImageUploadController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ImageUploadController.class);
    private static final long MAX_BYTES = 5L * 1024 * 1024;
    private static final String IMAGE_WEBP = "image/webp";
    private static final Map<String, String> FORMATS = Map.of(MediaType.IMAGE_JPEG_VALUE, "jpg",
            MediaType.IMAGE_PNG_VALUE, "png", IMAGE_WEBP, "webp");
    private final ImageStorageService storage;
    private final SpringDataInvitationImageRepository images;
    private final UserRepository users;
    private final Clock clock;

    public ImageUploadController(ImageStorageService storage, SpringDataInvitationImageRepository images,
                                 UserRepository users, Clock clock) {
        this.storage = storage;
        this.images = images;
        this.users = users;
        this.clock = clock;
    }

    private static void validate(MultipartFile image) throws IOException {
        byte[] signature = image.isEmpty() ? new byte[0] : image.getInputStream().readNBytes(12);
        if (image.isEmpty() || !FORMATS.containsKey(image.getContentType()) || image.getSize() > MAX_BYTES
                || !hasExpectedSignature(image.getContentType(), signature)) {
            throw new IllegalArgumentException("Image must be JPG, JPEG, PNG or WebP and no larger than 5 MB");
        }
    }

    private static void validateSocialDimensions(MultipartFile image) throws IOException {
        validate(image);
        if (IMAGE_WEBP.equals(image.getContentType())) return;
        BufferedImage decoded = ImageIO.read(image.getInputStream());
        if (decoded == null || decoded.getWidth() < 600 || decoded.getHeight() < 315)
            throw new IllegalArgumentException("Social image must be at least 600 x 315 pixels");
        double ratio = (double) decoded.getWidth() / decoded.getHeight();
        if (ratio < 1.7 || ratio > 2.1)
            throw new IllegalArgumentException("Social image aspect ratio must be close to 1.91:1");
    }

    private static boolean hasExpectedSignature(String type, byte[] value) {
        if (MediaType.IMAGE_JPEG_VALUE.equals(type)) return value.length >= 3 && unsigned(value[0]) == 255
                && unsigned(value[1]) == 216 && unsigned(value[2]) == 255;
        if (MediaType.IMAGE_PNG_VALUE.equals(type)) {
            int[] png = {137, 80, 78, 71, 13, 10, 26, 10};
            if (value.length < png.length) return false;
            for (int index = 0; index < png.length; index++) if (unsigned(value[index]) != png[index]) return false;
            return true;
        }
        return IMAGE_WEBP.equals(type) && value.length >= 12 && ascii(value, 0, "RIFF") && ascii(value, 8, "WEBP");
    }

    private static boolean ascii(byte[] value, int offset, String expected) {
        for (int index = 0; index < expected.length(); index++)
            if (value[offset + index] != (byte) expected.charAt(index)) return false;
        return true;
    }

    private static int unsigned(byte value) {
        return value & 255;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@RequestParam("image") MultipartFile image,
                                    @RequestParam UUID invitationId, @RequestParam ImageUploadContext.ImageKind context,
                                    @AuthenticationPrincipal AuthenticatedUser principal) {
        return uploadResponse(image, new ImageUploadContext(invitationId, context), principal);
    }

    @PostMapping(path = "/social", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadSocial(@RequestParam("image") MultipartFile image,
                                          @RequestParam UUID invitationId, @AuthenticationPrincipal AuthenticatedUser principal) {
        try {
            validateSocialDimensions(image);
            return uploadResponse(image,
                    new ImageUploadContext(invitationId, ImageUploadContext.ImageKind.SOCIAL), principal);
        } catch (IOException | RuntimeException exception) {
            return uploadFailure("validation", invitationId, exception);
        }
    }

    @DeleteMapping
    @Transactional
    public void delete(@RequestParam String url, @AuthenticationPrincipal AuthenticatedUser principal) throws IOException {
        User owner = owner(principal);
        InvitationImageJpaEntity stored = images.findByImageUrlAndOwnerId(url, owner.getId())
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));
        storage.delete(stored.getImagePublicId());
        images.delete(stored);
    }

    @Transactional
    private UploadedImage store(MultipartFile image, ImageUploadContext context,
                                AuthenticatedUser principal) throws IOException {
        LOGGER.info("Image upload received: invitationId={}, context={}, contentType={}, bytes={}",
                context.invitationId(), context.kind(), image.getContentType(), image.getSize());
        validate(image);
        if (context.kind() == ImageUploadContext.ImageKind.GALLERY
                && images.countByInvitationIdAndImageContext(context.invitationId(), "GALLERY") >= 10) {
            throw new IllegalArgumentException("Gallery cannot contain more than 10 images");
        }
        User owner = owner(principal);
        LOGGER.info("Image upload step=CLOUDINARY_START invitationId={}, context={}",
                context.invitationId(), context.kind());
        StoredImage stored = storage.upload(image, context);
        LOGGER.info("Image upload step=DATABASE_SAVE_START invitationId={}, context={}",
                context.invitationId(), context.kind());
        try {
            images.saveAndFlush(new InvitationImageJpaEntity(UUID.randomUUID(), context.invitationId(), owner.getId(),
                    stored.url(), stored.publicId(), stored.format(), stored.width(), stored.height(),
                    stored.bytes(), context.kind().name(), clock.instant()));
        } catch (RuntimeException exception) {
            LOGGER.error("Image upload failed at DATABASE_SAVE for invitationId={}, context={}: {}",
                    context.invitationId(), context.kind(), exception.getMessage(), exception);
            throw exception;
        }
        LOGGER.info("Image upload step=HTTP_RESPONSE invitationId={}, context={}",
                context.invitationId(), context.kind());
        return new UploadedImage(stored.url());
    }

    private ResponseEntity<?> uploadResponse(MultipartFile image, ImageUploadContext context,
                                             AuthenticatedUser principal) {
        try {
            UploadedImage uploaded = store(image, context, principal);
            return ResponseEntity.ok(uploaded);
        } catch (IOException | RuntimeException exception) {
            return uploadFailure("upload", context.invitationId(), exception);
        }
    }

    private ResponseEntity<UploadError> uploadFailure(String step, UUID invitationId, Exception exception) {
        LOGGER.error("Image upload request failed at step={} for invitationId={}: {}",
                step, invitationId, exception.getMessage(), exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new UploadError("IMAGE_UPLOAD_FAILED",
                        "No fue posible subir la imagen. Revisa la configuración del almacenamiento e inténtalo nuevamente."));
    }

    private User owner(AuthenticatedUser principal) {
        if (principal == null) throw new AuthenticationCredentialsNotFoundException("Authentication required");
        return users.findByPublicCode(principal.code())
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("User not found"));
    }

    public record UploadedImage(String url) {
    }

    public record UploadError(String error, String message) {
    }
}
