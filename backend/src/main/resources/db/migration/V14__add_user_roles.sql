ALTER TABLE users
    ADD COLUMN role VARCHAR(32) NOT NULL DEFAULT 'USER';

UPDATE users
SET role = 'ADMIN'
WHERE LOWER(email) = 'vivasjaviervictor@gmail.com';

CREATE INDEX idx_users_role ON users (role);
