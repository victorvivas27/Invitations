package com.invitation.invitation.web;

import com.invitation.invitation.domain.EventType;
import com.invitation.invitation.domain.InvitationViewMode;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record CreateInvitationRequest(
        @NotBlank @Size(max = 80) String templateId,
        InvitationViewMode viewMode,
        @NotNull EventType eventType,
        @NotBlank @Size(max = 120) String eventName,
        @NotBlank @Size(max = 100) String honoreeName,
        @Min(0) @Max(150) Integer honoreeAge,
        @NotNull LocalDate eventDate,
        @NotNull LocalTime eventTime,
        @NotBlank @Size(max = 150) String venueName,
        @NotBlank @Size(max = 250) String address,
        @Size(max = 500) @Pattern(regexp = "https?://.+", message = "mapsUrl must be a valid HTTP URL")
        String mapsUrl,
        @Size(max = 500) String heroImageUrl,
        @Size(max = 6) List<@Size(max = 500) String> galleryImageUrls,
        @NotBlank @Size(max = 1000) String message,
        @Size(max = 12000) String sectionBackgrounds,
        @Size(max = 3000) String contactInfo,
        @NotBlank @Size(max = 120) String shareTitle,
        @NotBlank @Size(max = 200) String shareDescription,
        @Size(max = 500) String shareImageUrl) { }
