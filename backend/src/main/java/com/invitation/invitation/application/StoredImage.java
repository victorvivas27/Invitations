package com.invitation.invitation.application;

public record StoredImage(String url, String publicId, String format,
                          int width, int height, long bytes) {
}
