package com.invitation.invitation.infrastructure;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@SuppressWarnings("PMD.GuardLogStatement")
public class CloudinarySchemaDiagnostics implements ApplicationRunner {
    private static final Logger LOGGER = LoggerFactory.getLogger(CloudinarySchemaDiagnostics.class);
    private static final List<String> EXPECTED_COLUMNS = List.of("id", "invitation_id", "owner_id",
            "image_url", "image_public_id", "image_format", "image_width", "image_height",
            "image_bytes", "image_context", "created_at");
    private final JdbcTemplate jdbcTemplate;

    public CloudinarySchemaDiagnostics(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments arguments) {
        try {
            List<String> columns = jdbcTemplate.queryForList("""
                    SELECT LOWER(column_name) FROM information_schema.columns
                    WHERE LOWER(table_name) = 'invitation_images'
                    """, String.class);
            LOGGER.info("Cloudinary DB schema diagnostic: invitation_imagesExists={}, expectedColumnsPresent={}, columns={}",
                    !columns.isEmpty(), columns.containsAll(EXPECTED_COLUMNS), columns);
        } catch (RuntimeException exception) {
            LOGGER.error("Cloudinary DB schema diagnostic failed: {}", exception.getMessage(), exception);
        }
    }
}
