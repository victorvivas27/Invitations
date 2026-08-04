package com.invitation.invitation.application;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.invitation.domain.Invitation;
import com.invitation.user.domain.User;
import com.invitation.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
public class DeleteOwnedInvitationService implements DeleteOwnedInvitationUseCase {
    private final InvitationRepository invitations;
    private final UserRepository users;
    private final InvitationImageCleaner imageCleaner;

    public DeleteOwnedInvitationService(InvitationRepository invitations, UserRepository users,
            InvitationImageCleaner imageCleaner) {
        this.invitations = invitations;
        this.users = users;
        this.imageCleaner = imageCleaner;
    }

    @Override
    @Transactional
    public void delete(String publicSlug, AuthenticatedUser principal) {
        if (principal == null) throw new AuthenticationCredentialsNotFoundException("Authentication required");
        User owner = users.findByPublicCode(principal.code())
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("User not found"));
        Invitation invitation = invitations.findByPublicSlug(publicSlug)
                .orElseThrow(InvitationNotFoundException::new);
        if (!invitation.ownerId().equals(owner.getId())) throw new AccessDeniedException("Invitation belongs to another user");
        invitations.delete(invitation);
        deleteImagesAfterCommit(invitation);
    }

    private void deleteImagesAfterCommit(Invitation invitation) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            imageCleaner.deleteImages(invitation);
            return;
        }
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override public void afterCommit() { imageCleaner.deleteImages(invitation); }
        });
    }
}
