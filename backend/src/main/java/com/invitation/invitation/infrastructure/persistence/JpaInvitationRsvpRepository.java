package com.invitation.invitation.infrastructure.persistence;

import com.invitation.invitation.application.InvitationRsvpRepository;
import com.invitation.invitation.domain.InvitationRsvp;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaInvitationRsvpRepository implements InvitationRsvpRepository {
    private final SpringDataInvitationRsvpRepository repository;

    public JpaInvitationRsvpRepository(SpringDataInvitationRsvpRepository repository) {
        this.repository = repository;
    }

    @Override
    public void save(InvitationRsvp value) {
        repository.save(new InvitationRsvpJpaEntity(value.id(), value.invitationId(),
                value.guestName(), value.guestNameNormalized(), value.guestCount(),
                value.attending(), value.message(), value.createdAt()));
    }

    @Override
    public boolean existsByInvitationIdAndGuestNameNormalized(UUID invitationId,
                                                              String normalizedName) {
        return repository.existsByInvitationIdAndGuestNameNormalized(invitationId, normalizedName);
    }

    @Override
    public Optional<InvitationRsvp> findByInvitationIdAndGuestNameNormalized(
            UUID invitationId, String normalizedName) {
        return repository.findByInvitationIdAndGuestNameNormalized(invitationId, normalizedName)
                .map(this::toDomain);
    }

    @Override
    public boolean existsByInvitationIdAndGuestNameNormalizedAndIdNot(
            UUID invitationId, String normalizedName, UUID id) {
        return repository.existsByInvitationIdAndGuestNameNormalizedAndIdNot(invitationId, normalizedName, id);
    }

    @Override
    public Optional<InvitationRsvp> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<InvitationRsvp> findAllByInvitationId(UUID invitationId) {
        return repository.findAllByInvitationIdOrderByCreatedAtDesc(invitationId).stream()
                .map(value -> new InvitationRsvp(value.getId(), value.getInvitationId(),
                        value.getGuestName(), value.getGuestNameNormalized(), value.getGuestCount(),
                        value.isAttending(), value.getMessage(), value.getCreatedAt())).toList();
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    private InvitationRsvp toDomain(InvitationRsvpJpaEntity value) {
        return new InvitationRsvp(value.getId(), value.getInvitationId(),
                value.getGuestName(), value.getGuestNameNormalized(), value.getGuestCount(),
                value.isAttending(), value.getMessage(), value.getCreatedAt());
    }
}
