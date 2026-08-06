package com.invitation.invitation.application;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageStorageService {
    StoredImage upload(MultipartFile file, ImageUploadContext context) throws IOException;

    void delete(String publicId) throws IOException;
}
