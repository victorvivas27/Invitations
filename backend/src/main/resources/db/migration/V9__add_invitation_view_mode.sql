ALTER TABLE invitations ADD COLUMN view_mode VARCHAR(20) NOT NULL DEFAULT 'SCROLL';
ALTER TABLE invitations ADD CONSTRAINT ck_invitations_view_mode CHECK (view_mode IN ('SCROLL', 'NAVIGATION'));
