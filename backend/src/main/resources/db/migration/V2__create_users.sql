CREATE TABLE users
(
    id            UUID                     NOT NULL,
    public_code   VARCHAR(16)              NOT NULL,
    first_name    VARCHAR(100)             NOT NULL,
    last_name     VARCHAR(100)             NOT NULL,
    email         VARCHAR(254)             NOT NULL,
    password_hash VARCHAR(255)             NOT NULL,
    status        VARCHAR(32)              NOT NULL DEFAULT 'ACTIVE',
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by    UUID                     NOT NULL,
    updated_by    UUID                     NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_public_code UNIQUE (public_code),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT ck_users_public_code CHECK (public_code LIKE 'ACC-%'),
    CONSTRAINT ck_users_audit_dates CHECK (updated_at >= created_at)
);

CREATE INDEX idx_users_status ON users (status);
