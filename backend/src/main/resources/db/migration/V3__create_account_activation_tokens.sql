ALTER TABLE users
    ALTER COLUMN password_hash DROP NOT NULL;

CREATE TABLE account_activation_tokens
(
    id         UUID                     NOT NULL,
    user_id    UUID                     NOT NULL,
    token_hash VARCHAR(64)              NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at    TIMESTAMP WITH TIME ZONE,
    CONSTRAINT pk_account_activation_tokens PRIMARY KEY (id),
    CONSTRAINT uk_activation_token_user UNIQUE (user_id),
    CONSTRAINT uk_activation_token_hash UNIQUE (token_hash),
    CONSTRAINT fk_activation_token_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_activation_token_expires_at ON account_activation_tokens (expires_at);
