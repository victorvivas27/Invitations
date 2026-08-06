CREATE TABLE invitations
(
    id           UUID                     NOT NULL,
    public_slug  VARCHAR(180)             NOT NULL,
    owner_id     UUID                     NOT NULL,
    template_id  VARCHAR(80)              NOT NULL,
    event_type   VARCHAR(40)              NOT NULL,
    event_name   VARCHAR(120)             NOT NULL,
    honoree_name VARCHAR(100)             NOT NULL,
    honoree_age  INTEGER,
    event_date   DATE                     NOT NULL,
    event_time   TIME                     NOT NULL,
    venue_name   VARCHAR(150)             NOT NULL,
    address      VARCHAR(250)             NOT NULL,
    message      VARCHAR(1000)            NOT NULL,
    status       VARCHAR(32)              NOT NULL,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT pk_invitations PRIMARY KEY (id),
    CONSTRAINT uk_invitations_public_slug UNIQUE (public_slug),
    CONSTRAINT fk_invitations_owner FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT ck_invitations_age CHECK (honoree_age IS NULL OR (honoree_age >= 0 AND honoree_age <= 150)),
    CONSTRAINT ck_invitations_status CHECK (status IN ('DRAFT', 'PUBLISHED')),
    CONSTRAINT ck_invitations_audit_dates CHECK (updated_at >= created_at)
);

CREATE INDEX idx_invitations_owner ON invitations (owner_id);
CREATE INDEX idx_invitations_public_status ON invitations (public_slug, status);
