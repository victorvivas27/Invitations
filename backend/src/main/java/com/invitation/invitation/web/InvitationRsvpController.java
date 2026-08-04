package com.invitation.invitation.web;

import com.invitation.invitation.application.ConfirmAttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/invitations/{publicSlug}/rsvps")
public class InvitationRsvpController {
    private final ConfirmAttendanceService service;
    public InvitationRsvpController(ConfirmAttendanceService service) { this.service = service; }
    @PostMapping
    public ResponseEntity<Void> confirm(@PathVariable String publicSlug,
            @Valid @RequestBody ConfirmAttendanceRequest request) {
        service.confirm(publicSlug, request.firstName(), request.lastName(), request.guestCount(),
                request.attending(), request.message());
        return ResponseEntity.noContent().build();
    }
}
