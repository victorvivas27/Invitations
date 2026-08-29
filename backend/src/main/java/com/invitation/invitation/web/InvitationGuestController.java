package com.invitation.invitation.web;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.invitation.application.InvitationGuest;
import com.invitation.invitation.application.DeleteInvitationGuestService;
import com.invitation.invitation.application.ListInvitationGuestsService;
import com.invitation.invitation.application.UpdateInvitationGuestService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations/{publicSlug}/guests")
public class InvitationGuestController {
    private final ListInvitationGuestsService service;
    private final UpdateInvitationGuestService updateService;
    private final DeleteInvitationGuestService deleteService;

    public InvitationGuestController(ListInvitationGuestsService service, UpdateInvitationGuestService updateService,
                                     DeleteInvitationGuestService deleteService) {
        this.service = service;
        this.updateService = updateService;
        this.deleteService = deleteService;
    }

    @GetMapping
    public List<InvitationGuest> list(@PathVariable String publicSlug,
                                      @AuthenticationPrincipal AuthenticatedUser user) {
        return service.list(publicSlug, user);
    }

    @PutMapping("/{guestId}")
    public InvitationGuest update(@PathVariable String publicSlug, @PathVariable java.util.UUID guestId,
                                  @Valid @RequestBody UpdateInvitationGuestRequest request,
                                  @AuthenticationPrincipal AuthenticatedUser user) {
        return updateService.update(publicSlug, guestId, request.name(), request.guestCount(),
                request.attending(), request.message(), user);
    }

    @DeleteMapping("/{guestId}")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String publicSlug, @PathVariable java.util.UUID guestId,
                       @AuthenticationPrincipal AuthenticatedUser user) {
        deleteService.delete(publicSlug, guestId, user);
    }
}
