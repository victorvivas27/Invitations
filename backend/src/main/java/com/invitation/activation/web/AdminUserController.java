package com.invitation.activation.web;

import com.invitation.activation.application.CreatePendingUserCommand;
import com.invitation.activation.application.PendingUserResult;
import com.invitation.activation.application.port.CreatePendingUserUseCase;
import com.invitation.activation.application.service.AdminUserService;
import com.invitation.auth.domain.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final CreatePendingUserUseCase useCase;
    private final AdminUserService adminUsers;

    public AdminUserController(CreatePendingUserUseCase useCase, AdminUserService adminUsers) {
        this.useCase = useCase;
        this.adminUsers = adminUsers;
    }

    @GetMapping
    public java.util.List<AdminUserResponse> list() {
        return adminUsers.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PendingUserResponse create(@Valid @RequestBody CreatePendingUserRequest request,
                                      @AuthenticationPrincipal AuthenticatedUser principal) {
        PendingUserResult result = useCase.create(new CreatePendingUserCommand(request.name(),
                request.email(), principal.code()));
        return new PendingUserResponse(result.code(), result.name(), result.email(), result.status());
    }

    @DeleteMapping("/{code}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String code,
                       @AuthenticationPrincipal AuthenticatedUser principal) {
        adminUsers.delete(code, principal);
    }
}
