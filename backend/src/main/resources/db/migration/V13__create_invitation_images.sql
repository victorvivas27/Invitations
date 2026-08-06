CREATE TABLE invitation_images
(
    id              UUID PRIMARY KEY,
    invitation_id   UUID                     NOT NULL,
    owner_id        UUID                     NOT NULL,
    image_url       VARCHAR(1000)            NOT NULL UNIQUE,
    image_public_id VARCHAR(500)             NOT NULL UNIQUE,
    image_format    VARCHAR(20)              NOT NULL,
    image_width     INTEGER                  NOT NULL,
    image_height    INTEGER                  NOT NULL,
    image_bytes     BIGINT                   NOT NULL,
    image_context   VARCHAR(20)              NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_invitation_images_invitation_id ON invitation_images (invitation_id);
