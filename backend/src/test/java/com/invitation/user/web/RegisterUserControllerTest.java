package com.invitation.user.web;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.hasKey;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.invitation.shared.web.GlobalExceptionHandler;
import com.invitation.user.application.DuplicateEmailException;
import com.invitation.user.application.RegisteredUser;
import com.invitation.user.application.port.RegisterUserUseCase;
import com.invitation.user.domain.UserStatus;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@SuppressWarnings("PMD.UnitTestShouldIncludeAssert")
class RegisterUserControllerTest {

    private static final Instant NOW = Instant.parse("2026-07-31T17:00:00Z");
    private static final String REGISTER_PATH = "/api/auth/register";
    private static final String VALID_BODY = """
            {"firstName":"Ana","lastName":"Pérez","email":"ana@example.com",
             "password":"Password1"}
            """;

    @Mock
    private RegisterUserUseCase useCase;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        Clock clock = Clock.fixed(NOW, ZoneOffset.UTC);
        mockMvc = MockMvcBuilders.standaloneSetup(new RegisterUserController(useCase))
                .setControllerAdvice(new GlobalExceptionHandler(clock))
                .build();
    }

    @Test
    void returnsCreatedPublicAccountWithoutSensitiveFields() throws Exception {
        when(useCase.register(any())).thenReturn(new RegisteredUser("ACC-ABC123DEF456", "Ana",
                "Pérez", "ana@example.com", UserStatus.ACTIVE, NOW));

        mockMvc.perform(post(REGISTER_PATH).contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpectAll(
                        status().isCreated(),
                        jsonPath("$.code").value("ACC-ABC123DEF456"),
                        jsonPath("$.status").value("ACTIVE"),
                        jsonPath("$").value(not(hasKey("id"))),
                        jsonPath("$").value(not(hasKey("passwordHash"))));
    }

    @Test
    void rejectsBlankRequiredFields() throws Exception {
        assertValidationError("""
                {"firstName":" ","lastName":" ","email":"ana@example.com",
                 "password":"Password1"}
                """);
    }

    @Test
    void rejectsInvalidEmail() throws Exception {
        assertValidationError("""
                {"firstName":"Ana","lastName":"Pérez","email":"invalid",
                 "password":"Password1"}
                """);
    }

    @Test
    void rejectsInvalidPassword() throws Exception {
        assertValidationError("""
                {"firstName":"Ana","lastName":"Pérez","email":"ana@example.com",
                 "password":"password"}
                """);
    }

    @Test
    void acceptsExternalSpacesBeforeApplicationNormalization() throws Exception {
        when(useCase.register(any())).thenReturn(new RegisteredUser("ACC-ABC123DEF456", "Ana",
                "Pérez", "ana@example.com", UserStatus.ACTIVE, NOW));

        String spacedEmailBody = VALID_BODY.replace("ana@example.com", " ANA@Example.COM ");

        mockMvc.perform(post(REGISTER_PATH).contentType(MediaType.APPLICATION_JSON)
                        .content(spacedEmailBody))
                .andExpect(status().isCreated());
    }

    @Test
    void returnsConflictForDuplicateEmail() throws Exception {
        when(useCase.register(any())).thenThrow(new DuplicateEmailException());

        mockMvc.perform(post(REGISTER_PATH).contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpectAll(
                        status().isConflict(),
                        jsonPath("$.status").value(409),
                        jsonPath("$.error").value("Conflict"),
                        jsonPath("$.message").value("An account with this email already exists"),
                        jsonPath("$.path").value(REGISTER_PATH));
    }

    private void assertValidationError(String body) throws Exception {
        mockMvc.perform(post(REGISTER_PATH).contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpectAll(
                        status().isBadRequest(),
                        content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                        jsonPath("$.status").value(400),
                        jsonPath("$.error").value("Validation failed"),
                        jsonPath("$.path").value(REGISTER_PATH));
    }
}
