package com.invitation.auth.application.service;

import com.invitation.auth.application.InvalidCredentialsException;
import com.invitation.auth.application.PublicUser;
import com.invitation.auth.application.port.CurrentUserUseCase;
import com.invitation.auth.domain.AuthenticatedUser;
import com.invitation.user.domain.User;
import com.invitation.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CurrentUserService implements CurrentUserUseCase {
    private final UserRepository repository;

    public CurrentUserService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public PublicUser find(AuthenticatedUser principal) {
        User user = repository.findByPublicCode(principal.code())
                .orElseThrow(InvalidCredentialsException::new);
        return new PublicUser(user.getPublicCode(), user.getFirstName(), user.getLastName(),
                user.getEmail(), user.getStatus(), user.getRole());
    }
}
