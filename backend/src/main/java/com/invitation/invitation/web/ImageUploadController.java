package com.invitation.invitation.web;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/invitation-images")
public class ImageUploadController {
    private static final long MAX_BYTES = 5L * 1024 * 1024;
    private static final Map<String, String> EXTENSIONS = Map.of(
            MediaType.IMAGE_JPEG_VALUE, ".jpg", MediaType.IMAGE_PNG_VALUE, ".png",
            "image/webp", ".webp");
    private final Path uploadDirectory;

    public ImageUploadController(@Value("${app.upload-directory:uploads}") String uploadDirectory) {
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadedImage upload(@RequestParam("image") MultipartFile image) throws IOException {
        return store(image, false);
    }

    @PostMapping(path = "/social", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadedImage uploadSocial(@RequestParam("image") MultipartFile image) throws IOException {
        return store(image, true);
    }

    private UploadedImage store(MultipartFile image, boolean social) throws IOException {
        String extension = EXTENSIONS.get(image.getContentType());
        byte[] signature = image.isEmpty() ? new byte[0] : image.getInputStream().readNBytes(12);
        if (image.isEmpty() || extension == null || image.getSize() > MAX_BYTES
                || !hasExpectedSignature(image.getContentType(), signature)) {
            throw new IllegalArgumentException("Image must be JPG, PNG or WebP and no larger than 5 MB");
        }
        if (social) validateSocialDimensions(image);
        Files.createDirectories(uploadDirectory);
        String fileName = UUID.randomUUID() + extension;
        Path destination = uploadDirectory.resolve(fileName).normalize();
        if (!destination.getParent().equals(uploadDirectory)) throw new IllegalArgumentException("Invalid image path");
        image.transferTo(destination);
        return new UploadedImage("/uploads/" + fileName);
    }

    private static void validateSocialDimensions(MultipartFile image) throws IOException {
        if ("image/webp".equals(image.getContentType())) {
            throw new IllegalArgumentException("Social image must be JPG or PNG");
        }
        BufferedImage decoded = ImageIO.read(image.getInputStream());
        if (decoded == null || decoded.getWidth() < 600 || decoded.getHeight() < 315) {
            throw new IllegalArgumentException("Social image must be at least 600 x 315 pixels");
        }
        double ratio = (double) decoded.getWidth() / decoded.getHeight();
        if (ratio < 1.7 || ratio > 2.1) {
            throw new IllegalArgumentException("Social image aspect ratio must be close to 1.91:1");
        }
    }

    private static boolean hasExpectedSignature(String contentType, byte[] value) {
        if (MediaType.IMAGE_JPEG_VALUE.equals(contentType)) {
            return value.length >= 3 && unsigned(value[0]) == 0xff
                    && unsigned(value[1]) == 0xd8 && unsigned(value[2]) == 0xff;
        }
        if (MediaType.IMAGE_PNG_VALUE.equals(contentType)) {
            int[] png = {0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a};
            if (value.length < png.length) return false;
            for (int index = 0; index < png.length; index++) {
                if (unsigned(value[index]) != png[index]) return false;
            }
            return true;
        }
        return "image/webp".equals(contentType) && value.length >= 12
                && ascii(value, 0, "RIFF") && ascii(value, 8, "WEBP");
    }

    private static boolean ascii(byte[] value, int offset, String expected) {
        for (int index = 0; index < expected.length(); index++) {
            if (value[offset + index] != (byte) expected.charAt(index)) return false;
        }
        return true;
    }

    private static int unsigned(byte value) { return value & 0xff; }

    public record UploadedImage(String url) { }
}
