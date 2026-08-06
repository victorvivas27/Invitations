package com.invitation.invitation.web;

import jakarta.validation.constraints.*;

public record ConfirmAttendanceRequest(@NotBlank @Size(max = 55) String firstName,
                                       @NotBlank @Size(max = 55) String lastName,
                                       @Min(1) @Max(20) int guestCount, @NotNull Boolean attending,
                                       @Size(max = 500) String message) {
}
