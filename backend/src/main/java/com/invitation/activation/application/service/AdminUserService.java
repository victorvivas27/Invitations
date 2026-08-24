package com.invitation.activation.application.service;

import com.invitation.activation.web.AdminUserResponse;
import com.invitation.auth.application.InvalidCredentialsException;
import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.user.domain.User;
import com.invitation.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.util.List;

@Service
public class AdminUserService {
    private final UserRepository users;
    private final Clock clock;

    public AdminUserService(UserRepository users, Clock clock) {
        this.users = users;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> list() {
        return users.findAll().stream().map(AdminUserService::response).toList();
    }

    @Transactional
    public void delete(String code, AuthenticatedUser principal) {
        if (principal.code().equalsIgnoreCase(code)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "An administrator cannot delete their own account");
        }
        User actor = users.findByPublicCode(principal.code())
                .orElseThrow(InvalidCredentialsException::new);
        User target = users.findByPublicCode(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User not found"));
        if (target.getStatus() != com.invitation.user.domain.UserStatus.DELETED) {
            users.save(target.delete(actor.getId(), clock.instant()));
        }
    }

    private static AdminUserResponse response(User user) {
        return new AdminUserResponse(user.getPublicCode(), user.getFirstName(), user.getLastName(),
                user.getEmail(), user.getStatus(), user.getRole(), user.getCreatedAt());
    }
}
