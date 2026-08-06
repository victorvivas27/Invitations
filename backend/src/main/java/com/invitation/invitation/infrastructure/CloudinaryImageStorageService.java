package com.invitation.invitation.infrastructure;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.invitation.invitation.application.ImageStorageService;
import com.invitation.invitation.application.ImageUploadContext;
import com.invitation.invitation.application.StoredImage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@SuppressWarnings("PMD.GuardLogStatement")
public class CloudinaryImageStorageService implements ImageStorageService {
    private static final Logger LOGGER = LoggerFactory.getLogger(CloudinaryImageStorageService.class);
    private final Cloudinary cloudinary;
    private final String uploadPreset;

    public CloudinaryImageStorageService(@Value("${app.cloudinary.cloud-name}") String cloudName,
                                         @Value("${app.cloudinary.api-key}") String apiKey,
                                         @Value("${app.cloudinary.api-secret}") String apiSecret,
                                         @Value("${app.cloudinary.upload-preset}") String uploadPreset) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap("cloud_name", cloudName,
                "api_key", apiKey, "api_secret", apiSecret, "secure", true));
        this.uploadPreset = uploadPreset;
        LOGGER.info("Cloudinary SDK initialized: cloudNamePresent={}, apiKeyPresent={}, "
                        + "apiSecretPresent={}, uploadPresetPresent={}",
                !cloudName.isBlank(), !apiKey.isBlank(), !apiSecret.isBlank(), !uploadPreset.isBlank());
    }

    private static String folder(ImageUploadContext.ImageKind kind) {
        return switch (kind) {
            case COVER, SOCIAL -> "cover";
            case GALLERY -> "gallery";
            case DECORATION -> "decorations";
        };
    }

    private static String deliveryUrl(String secureUrl, ImageUploadContext.ImageKind kind) {
        String transformation = switch (kind) {
            case COVER -> "w_1200,h_800,c_fill,f_auto,q_auto";
            case SOCIAL -> "w_1200,h_630,c_fill,f_auto,q_auto";
            case GALLERY -> "w_1200,c_limit,f_auto,q_auto";
            case DECORATION -> "w_1600,c_limit,f_auto,q_auto";
        };
        return secureUrl.replace("/upload/", "/upload/" + transformation + "/");
    }

    private static String required(Map<?, ?> result, String key) {
        Object value = result.get(key);
        if (value == null) throw new IllegalStateException("Cloudinary response omitted " + key);
        return value.toString();
    }

    private static Number number(Map<?, ?> result, String key) {
        Object value = result.get(key);
        if (value instanceof Number number) return number;
        throw new IllegalStateException("Cloudinary response omitted " + key);
    }

    @Override
    public StoredImage upload(MultipartFile file, ImageUploadContext context) throws IOException {
        String folder = "app/invitations/" + context.invitationId() + "/" + folder(context.kind());
        LOGGER.info("Calling Cloudinary upload: invitationId={}, context={}, folder={}, bytes={}",
                context.invitationId(), context.kind(), folder, file.getSize());
        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", folder, "upload_preset", uploadPreset, "resource_type", "image"));
            LOGGER.info("Cloudinary upload completed: invitationId={}, context={}, publicIdPresent={}",
                    context.invitationId(), context.kind(), result.get("public_id") != null);
            return new StoredImage(deliveryUrl(required(result, "secure_url"), context.kind()),
                    required(result, "public_id"), required(result, "format"),
                    number(result, "width").intValue(), number(result, "height").intValue(),
                    number(result, "bytes").longValue());
        } catch (IOException | RuntimeException exception) {
            LOGGER.error("Cloudinary upload failed for invitationId={}, context={}: {}",
                    context.invitationId(), context.kind(), exception.getMessage(), exception);
            throw exception;
        }
    }

    @Override
    public void delete(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image", "invalidate", true));
    }
}
