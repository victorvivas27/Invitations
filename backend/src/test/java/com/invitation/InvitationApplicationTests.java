package com.invitation;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class InvitationApplicationTests {

    private final ApplicationContext applicationContext;

    InvitationApplicationTests(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Test
    void contextLoads() {
        assertThat(applicationContext).isNotNull();
    }

}
