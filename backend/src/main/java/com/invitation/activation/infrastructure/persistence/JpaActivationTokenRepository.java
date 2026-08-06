package com.invitation.activation.infrastructure.persistence;

import com.invitation.activation.application.port.ActivationTokenRepository;
import com.invitation.activation.domain.AccountActivationToken;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaActivationTokenRepository implements ActivationTokenRepository {
    private final SpringDataActivationTokenRepository repository;

    public JpaActivationTokenRepository(SpringDataActivationTokenRepository repository) {
        this.repository = repository;
    }

    private static ActivationTokenJpaEntity toEntity(AccountActivationToken token) {
        return new ActivationTokenJpaEntity(token.id(), token.userId(), token.tokenHash(),
                token.expiresAt(), token.createdAt(), token.usedAt());
    }

    private static AccountActivationToken toDomain(ActivationTokenJpaEntity entity) {
        return new AccountActivationToken(entity.getId(), entity.getUserId(), entity.getTokenHash(),
                entity.getExpiresAt(), entity.getCreatedAt(), entity.getUsedAt());
    }

    @Override
    public AccountActivationToken save(AccountActivationToken token) {
        return toDomain(repository.saveAndFlush(toEntity(token)));
    }

    @Override
    public Optional<AccountActivationToken> findByHash(String tokenHash) {
        return repository.findByTokenHash(tokenHash).map(JpaActivationTokenRepository::toDomain);
    }

    @Override
    public void deleteByUserId(UUID userId) {
        repository.deleteByUserId(userId);
        repository.flush();
    }
}
