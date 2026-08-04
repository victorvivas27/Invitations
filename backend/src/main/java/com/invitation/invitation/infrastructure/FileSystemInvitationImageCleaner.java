package com.invitation.invitation.infrastructure;

import com.invitation.invitation.application.InvitationImageCleaner;
import com.invitation.invitation.domain.Invitation;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FileSystemInvitationImageCleaner implements InvitationImageCleaner {
    private static final Logger LOGGER = LoggerFactory.getLogger(FileSystemInvitationImageCleaner.class);
    private static final Pattern UPLOADED_IMAGE = Pattern.compile(
            "/uploads/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\.(?:jpg|png|webp))");
    private final Path uploadDirectory;

    public FileSystemInvitationImageCleaner(@Value("${app.upload-directory:uploads}") String uploadDirectory) {
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
    }

    @Override
    public void deleteImages(Invitation invitation) {
        Set<String> fileNames = new HashSet<>();
        collect(invitation.heroImageUrl(), fileNames);
        invitation.galleryImageUrls().forEach(value -> collect(value, fileNames));
        collect(invitation.sectionBackgrounds(), fileNames);
        fileNames.forEach(this::deleteSafely);
    }

    private static void collect(String value, Set<String> fileNames) {
        if (value == null) return;
        Matcher matcher = UPLOADED_IMAGE.matcher(value);
        while (matcher.find()) fileNames.add(matcher.group(1));
    }

    private void deleteSafely(String fileName) {
        Path target = uploadDirectory.resolve(fileName).normalize();
        if (!target.getParent().equals(uploadDirectory)) return;
        try {
            Files.deleteIfExists(target);
        } catch (IOException exception) {
            LOGGER.warn("Could not delete invitation image {}", target, exception);
        }
    }
}
