package com.invitation.invitation.web;

import com.invitation.invitation.application.GetPublicInvitationUseCase;
import com.invitation.invitation.application.PublicInvitation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/invitations")
public class PublicInvitationController {
    private final GetPublicInvitationUseCase useCase;
    public PublicInvitationController(GetPublicInvitationUseCase useCase) { this.useCase = useCase; }
    @GetMapping("/{slug}")
    public PublicInvitation get(@PathVariable String slug) { return useCase.get(slug); }
}
