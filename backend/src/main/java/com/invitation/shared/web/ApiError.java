package com.invitation.shared.web;

import java.time.Instant;

public record ApiError(int status, String error, String message, String path, Instant timestamp) {
}
