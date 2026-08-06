package com.invitation.invitation.web;

import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.invitation.application.InvitationGuest;
import com.invitation.invitation.application.ListInvitationGuestsService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/invitations/{publicSlug}/guests")
public class InvitationGuestController {
    private final ListInvitationGuestsService service;

    public InvitationGuestController(ListInvitationGuestsService service) {
        this.service = service;
    }

    @GetMapping
    public List<InvitationGuest> list(@PathVariable String publicSlug,
                                      @AuthenticationPrincipal AuthenticatedUser user) {
        return service.list(publicSlug, user);
    }
}
