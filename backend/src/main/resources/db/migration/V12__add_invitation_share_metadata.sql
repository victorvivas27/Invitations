ALTER TABLE invitations
    ADD COLUMN share_title VARCHAR(120);
ALTER TABLE invitations
    ADD COLUMN share_description VARCHAR(200);
ALTER TABLE invitations
    ADD COLUMN share_image_url VARCHAR(500);

UPDATE invitations
SET share_title = event_name
WHERE share_title IS NULL;
UPDATE invitations
SET share_description = LEFT (message, 200)
WHERE share_description IS NULL;
UPDATE invitations
SET share_image_url = hero_image_url
WHERE share_image_url IS NULL;
