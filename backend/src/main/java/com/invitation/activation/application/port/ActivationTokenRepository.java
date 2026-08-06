package com.invitation.activation.application.port;

import com.invitation.activation.domain.AccountActivationToken;

import java.util.Optional;
import java.util.UUID;

public interface ActivationTokenRepository {
    AccountActivationToken save(AccountActivationToken token);

    Optional<AccountActivationToken> findByHash(String tokenHash);

    void deleteByUserId(UUID userId);
}
