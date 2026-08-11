package com.invitation.invitation.web;

import jakarta.validation.constraints.*;

public record UpdateInvitationGuestRequest(@NotBlank @Size(max = 120) String name,
                                           @Min(1) @Max(20) int guestCount,
                                           @NotNull Boolean attending,
                                           @Size(max = 500) String message) {
}
