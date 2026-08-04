package com.invitation.invitation.web;

import static org.hamcrest.Matchers.hasKey;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
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

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@SuppressWarnings("PMD.UnitTestShouldIncludeAssert")
class InvitationFlowTest {
    private static final String CREATE = "/api/invitations";
    private static final String AUTHORIZATION = "Authorization";
    private static final String BEARER = "Bearer ";
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    private String token;

    @BeforeEach
    void authenticate() throws Exception {
        String email = "creator-" + System.nanoTime() + "@example.com";
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"firstName":"Ana","lastName":"Pérez","email":"%s","password":"Password1"}
                        """.formatted(email))).andExpect(status().isCreated());
        MvcResult login = mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"%s\",\"password\":\"Password1\"}".formatted(email)))
                .andExpect(status().isOk()).andReturn();
        token = objectMapper.readTree(login.getResponse().getContentAsString()).get("token").asText();
    }

    @Test
    void createsAndReadsPublishedInvitationWithoutExposingInternalData() throws Exception {
        MvcResult creation = mockMvc.perform(post(CREATE).header(AUTHORIZATION, BEARER + token)
                .contentType(MediaType.APPLICATION_JSON).content(validBody()))
                .andExpectAll(status().isCreated(), jsonPath("$.status").value("PUBLISHED"),
                        jsonPath("$.eventName").value("Cumpleaños de Sofía"),
                        jsonPath("$.publicSlug").value(org.hamcrest.Matchers.matchesPattern(
                                "cumpleanos-de-sofia-[a-z0-9]{8}")),
                        header().string("Location", org.hamcrest.Matchers.startsWith(
                                "/api/public/invitations/")))
                .andReturn();
        JsonNode result = objectMapper.readTree(creation.getResponse().getContentAsString());
        String slug = result.get("publicSlug").asText();
        mockMvc.perform(get("/api/public/invitations/" + slug))
                .andExpectAll(status().isOk(), jsonPath("$.templateId").value("birthday-urban"),
                        jsonPath("$.honoreeName").value("Sofía"),
                        jsonPath("$").value(not(hasKey("id"))),
                        jsonPath("$").value(not(hasKey("ownerId"))),
                        jsonPath("$").value(not(hasKey("status"))));
    }

    @Test
    void creationRequiresAuthenticationButPublicLookupDoesNot() throws Exception {
        mockMvc.perform(post(CREATE).contentType(MediaType.APPLICATION_JSON).content(validBody()))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/public/invitations/does-not-exist"))
                .andExpectAll(status().isNotFound(), jsonPath("$.error").value("INVITATION_NOT_FOUND"));
    }

    @Test
    void rejectsUnknownAndUpcomingTemplates() throws Exception {
        for (String template : new String[]{"unknown", "anniversary-night"}) {
            mockMvc.perform(post(CREATE).header(AUTHORIZATION, BEARER + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(validBody().replace("birthday-urban", template)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Test
    void rejectsPastDatesAndInvalidAges() throws Exception {
        mockMvc.perform(post(CREATE).header(AUTHORIZATION, BEARER + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(validBody().replace("2027-08-22", "2020-01-01")))
                .andExpect(status().isBadRequest());
        mockMvc.perform(post(CREATE).header(AUTHORIZATION, BEARER + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(validBody().replace("\"honoreeAge\":5", "\"honoreeAge\":151")))
                .andExpect(status().isBadRequest());
    }

    private static String validBody() {
        return """
                {"templateId":"birthday-urban","eventType":"BIRTHDAY",
                 "eventName":" Cumpleaños de Sofía ","honoreeName":" Sofía ","honoreeAge":5,
                 "eventDate":"2027-08-22","eventTime":"17:00","venueName":" Salón Central ",
                 "address":" Avenida Principal 123 ","message":" Te esperamos para celebrar. ",
                 "shareTitle":"Cumpleaños de Sofía","shareDescription":"Acompáñanos a celebrar.",
                 "shareImageUrl":"https://cdn.example.com/share.jpg"}
                """;
    }
}
