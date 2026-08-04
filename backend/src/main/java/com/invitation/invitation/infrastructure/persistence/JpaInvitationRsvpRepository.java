package com.invitation.invitation.infrastructure.persistence;

import com.invitation.invitation.application.InvitationRsvpRepository;
import com.invitation.invitation.domain.InvitationRsvp;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public class JpaInvitationRsvpRepository implements InvitationRsvpRepository {
    private final SpringDataInvitationRsvpRepository repository;
    public JpaInvitationRsvpRepository(SpringDataInvitationRsvpRepository repository) {
        this.repository = repository;
    }
    @Override public void save(InvitationRsvp value) {
        repository.save(new InvitationRsvpJpaEntity(value.id(), value.invitationId(),
                value.guestName(), value.guestNameNormalized(), value.guestCount(),
                value.attending(), value.message(), value.createdAt()));
    }
    @Override public boolean existsByInvitationIdAndGuestNameNormalized(UUID invitationId,
            String normalizedName) {
        return repository.existsByInvitationIdAndGuestNameNormalized(invitationId, normalizedName);
    }
    @Override public List<InvitationRsvp> findAllByInvitationId(UUID invitationId) {
        return repository.findAllByInvitationIdOrderByCreatedAtDesc(invitationId).stream()
                .map(value -> new InvitationRsvp(value.getId(), value.getInvitationId(),
                        value.getGuestName(), value.getGuestNameNormalized(), value.getGuestCount(),
                        value.isAttending(), value.getMessage(), value.getCreatedAt())).toList();
    }
}
