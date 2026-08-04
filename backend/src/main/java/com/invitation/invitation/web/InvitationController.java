package com.invitation.invitation.web;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.invitation.application.CreateInvitationCommand;
import com.invitation.invitation.application.CreateInvitationUseCase;
import com.invitation.invitation.application.CreatedInvitation;
import com.invitation.invitation.application.ListOwnedInvitationsUseCase;
import com.invitation.invitation.application.OwnedInvitation;
import com.invitation.invitation.application.DeleteOwnedInvitationUseCase;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {
    private final CreateInvitationUseCase useCase;
    private final ListOwnedInvitationsUseCase listUseCase;
    private final DeleteOwnedInvitationUseCase deleteUseCase;
    public InvitationController(CreateInvitationUseCase useCase, ListOwnedInvitationsUseCase listUseCase,
            DeleteOwnedInvitationUseCase deleteUseCase) {
        this.useCase = useCase;
        this.listUseCase = listUseCase;
        this.deleteUseCase = deleteUseCase;
    }
    @GetMapping
    public List<OwnedInvitation> list(@AuthenticationPrincipal AuthenticatedUser user) {
        return listUseCase.list(user);
    }
    @DeleteMapping("/{publicSlug}")
    public ResponseEntity<Void> delete(@PathVariable String publicSlug,
            @AuthenticationPrincipal AuthenticatedUser user) {
        deleteUseCase.delete(publicSlug, user);
        return ResponseEntity.noContent().build();
    }
    @PostMapping
    public ResponseEntity<CreatedInvitation> create(@Valid @RequestBody CreateInvitationRequest request,
            @AuthenticationPrincipal AuthenticatedUser user) {
        CreatedInvitation result = useCase.create(new CreateInvitationCommand(request.templateId(), request.viewMode(),
                request.eventType(), request.eventName(), request.honoreeName(), request.honoreeAge(),
                request.eventDate(), request.eventTime(), request.venueName(), request.address(),
                request.mapsUrl(), request.heroImageUrl(), request.galleryImageUrls(), request.message(), request.sectionBackgrounds(), request.contactInfo(),
                request.shareTitle(), request.shareDescription(), request.shareImageUrl()), user);
        return ResponseEntity.created(URI.create("/api/public/invitations/" + result.publicSlug())).body(result);
    }
}
