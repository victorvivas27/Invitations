package com.invitation.activation.infrastructure;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app")
public record ActivationProperties(@NotBlank String frontendUrl,
        @Positive long accountActivationExpirationSeconds) { }
