package com.invitation.invitation.web;

import com.invitation.invitation.application.ConfirmAttendanceService;
import com.invitation.invitation.application.ListPublicInvitationGuestsService;
import com.invitation.invitation.application.PublicInvitationGuest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/invitations/{publicSlug}/rsvps")
public class InvitationRsvpController {
    private final ConfirmAttendanceService service;
    private final ListPublicInvitationGuestsService guestService;

    public InvitationRsvpController(ConfirmAttendanceService service,
                                    ListPublicInvitationGuestsService guestService) {
        this.service = service;
        this.guestService = guestService;
    }

    @GetMapping
    public List<PublicInvitationGuest> guests(@PathVariable String publicSlug) {
        return guestService.list(publicSlug);
    }

    @PostMapping
    public ResponseEntity<Void> confirm(@PathVariable String publicSlug,
                                        @Valid @RequestBody ConfirmAttendanceRequest request) {
        service.confirm(publicSlug, request.firstName(), request.lastName(), request.guestCount(),
                request.attending(), request.message());
        return ResponseEntity.noContent().build();
    }
}
