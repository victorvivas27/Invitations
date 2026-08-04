package com.invitation.auth.web;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.hasKey;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest(properties = "app.cors.allowed-origins=http://localhost:5173,http://localhost:5174")
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@SuppressWarnings("PMD.UnitTestShouldIncludeAssert")
class AuthenticationSecurityTest {
    private static final String REGISTER = "/api/auth/register";
    private static final String LOGIN = "/api/auth/login";
    private static final String ME = "/api/auth/me";
    private static final String ORIGIN = "Origin";
    private static final String REQUEST_METHOD = "Access-Control-Request-Method";
    private static final String REQUEST_HEADERS = "Access-Control-Request-Headers";
    private static final String REGISTRATION_BODY = """
            {"firstName":"Ana","lastName":"Pérez","email":"security@example.com",
             "password":"Password1"}
            """;
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void registrationAndLoginRemainPublic() throws Exception {
        mockMvc.perform(post(REGISTER).contentType(MediaType.APPLICATION_JSON)
                        .content(REGISTRATION_BODY))
                .andExpect(status().isCreated());

        mockMvc.perform(post(LOGIN).contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody()))
                .andExpect(status().isOk());
    }

    @Test
    void registrationPreflightAllowsOnlyConfiguredFrontend() throws Exception {
        mockMvc.perform(options(REGISTER)
                        .header(ORIGIN, "http://localhost:5173")
                        .header(REQUEST_METHOD, "POST")
                        .header(REQUEST_HEADERS, "content-type"))
                .andExpectAll(status().isOk(),
                        header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    void registrationPreflightAllowsSecondConfiguredDevelopmentPort() throws Exception {
        mockMvc.perform(options(REGISTER)
                        .header(ORIGIN, "http://localhost:5174")
                        .header(REQUEST_METHOD, "POST")
                        .header(REQUEST_HEADERS, "content-type"))
                .andExpectAll(status().isOk(),
                        header().string("Access-Control-Allow-Origin", "http://localhost:5174"));
    }

    @Test
    void registrationPreflightRejectsPrivateDevelopmentNetwork() throws Exception {
        mockMvc.perform(options(REGISTER)
                        .header(ORIGIN, "http://192.168.1.50:5173")
                        .header(REQUEST_METHOD, "POST")
                        .header(REQUEST_HEADERS, "content-type"))
                .andExpect(status().isForbidden());
    }

    @Test
    void invitationDeletePreflightRejectsPrivateDevelopmentNetwork() throws Exception {
        mockMvc.perform(options("/api/invitations/example-slug")
                        .header(ORIGIN, "http://192.168.100.165:5173")
                        .header(REQUEST_METHOD, "DELETE")
                        .header(REQUEST_HEADERS, "authorization"))
                .andExpect(status().isForbidden());
    }

    @Test
    void meRequiresATokenAndRejectsInvalidBearer() throws Exception {
        mockMvc.perform(get(ME)).andExpect(status().isUnauthorized());
        mockMvc.perform(get(ME).header("Authorization", "Basic invalid"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get(ME).header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void validBearerReturnsOnlyPublicCurrentUser() throws Exception {
        mockMvc.perform(post(REGISTER).contentType(MediaType.APPLICATION_JSON)
                .content(REGISTRATION_BODY)).andExpect(status().isCreated());
        MvcResult login = mockMvc.perform(post(LOGIN).contentType(MediaType.APPLICATION_JSON)
                .content(loginBody())).andExpect(status().isOk()).andReturn();
        JsonNode response = objectMapper.readTree(login.getResponse().getContentAsString());
        String token = response.get("token").asText();

        mockMvc.perform(get(ME).header("Authorization", "Bearer " + token))
                .andExpectAll(status().isOk(),
                        jsonPath("$.code").value("ACC-" + response.get("user").get("code")
                                .asText().substring(4)),
                        jsonPath("$.email").value("security@example.com"),
                        jsonPath("$").value(not(hasKey("id"))),
                        jsonPath("$").value(not(hasKey("passwordHash"))));
    }

    private static String loginBody() {
        return """
                {"email":" SECURITY@Example.com ","password":"Password1"}
                """;
    }
}
