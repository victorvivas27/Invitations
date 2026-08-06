package com.invitation.shared.web;

import com.invitation.activation.application.ActivationTokenGoneException;
import com.invitation.activation.application.ActivationTokenMalformedException;
import com.invitation.activation.application.ActivationTokenNotFoundException;
import com.invitation.auth.application.InvalidCredentialsException;
import com.invitation.invitation.application.DuplicateInvitationGuestException;
import com.invitation.invitation.application.InvitationNotFoundException;
import com.invitation.user.application.DuplicateEmailException;
import com.invitation.user.application.InvalidPasswordException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Clock;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final Clock clock;

    public GlobalExceptionHandler(Clock clock) {
        this.clock = clock;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> validation(MethodArgumentNotValidException exception,
                                        HttpServletRequest request) {
        String fields = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField()).distinct().sorted()
                .collect(Collectors.joining(", "));
        return response(HttpStatus.BAD_REQUEST, "Validation failed",
                "The request contains invalid fields: " + fields, request);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    ResponseEntity<ApiError> invalidPassword(InvalidPasswordException exception,
                                             HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "Validation failed", exception.getMessage(), request);
    }

    @ExceptionHandler(DuplicateEmailException.class)
    ResponseEntity<ApiError> duplicateEmail(DuplicateEmailException exception,
                                            HttpServletRequest request) {
        return response(HttpStatus.CONFLICT, "Conflict", exception.getMessage(), request);
    }

    @ExceptionHandler(DuplicateInvitationGuestException.class)
    ResponseEntity<ApiError> duplicateInvitationGuest(DuplicateInvitationGuestException exception,
                                                      HttpServletRequest request) {
        return response(HttpStatus.CONFLICT, "Conflict", exception.getMessage(), request);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    ResponseEntity<ApiError> invalidCredentials(InvalidCredentialsException exception,
                                                HttpServletRequest request) {
        return response(HttpStatus.UNAUTHORIZED, "Unauthorized", exception.getMessage(), request);
    }

    @ExceptionHandler(ActivationTokenMalformedException.class)
    ResponseEntity<ApiError> malformedActivationToken(ActivationTokenMalformedException exception,
                                                      HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "Bad Request", exception.getMessage(), request);
    }

    @ExceptionHandler(ActivationTokenNotFoundException.class)
    ResponseEntity<ApiError> missingActivationToken(ActivationTokenNotFoundException exception,
                                                    HttpServletRequest request) {
        return response(HttpStatus.NOT_FOUND, "Not Found", exception.getMessage(), request);
    }

    @ExceptionHandler(ActivationTokenGoneException.class)
    ResponseEntity<ApiError> goneActivationToken(ActivationTokenGoneException exception,
                                                 HttpServletRequest request) {
        return response(HttpStatus.GONE, "Gone", exception.getMessage(), request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ApiError> invalidArgument(IllegalArgumentException exception,
                                             HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "Bad Request", exception.getMessage(), request);
    }

    @ExceptionHandler(InvitationNotFoundException.class)
    ResponseEntity<ApiError> invitationNotFound(InvitationNotFoundException exception,
                                                HttpServletRequest request) {
        return response(HttpStatus.NOT_FOUND, "INVITATION_NOT_FOUND", exception.getMessage(), request);
    }

    @ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
    ResponseEntity<ApiError> authenticationMissing(AuthenticationCredentialsNotFoundException exception,
                                                   HttpServletRequest request) {
        return response(HttpStatus.UNAUTHORIZED, "Unauthorized", "Authentication required", request);
    }

    @ExceptionHandler(RuntimeException.class)
    ResponseEntity<ApiError> unexpected(RuntimeException exception, HttpServletRequest request) {
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
                "An unexpected error occurred", request);
    }

    private ResponseEntity<ApiError> response(HttpStatus status, String error, String message,
                                              HttpServletRequest request) {
        ApiError body = new ApiError(status.value(), error, message,
                request.getRequestURI(), clock.instant());
        return ResponseEntity.status(status).body(body);
    }
}
