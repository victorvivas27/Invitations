package com.invitation.invitation.application;

import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
    StoredImage upload(MultipartFile file, ImageUploadContext context) throws IOException;
    void delete(String publicId) throws IOException;
}
