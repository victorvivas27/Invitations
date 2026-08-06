ALTER TABLE invitation_rsvps
    ADD COLUMN guest_name_normalized VARCHAR(120);

UPDATE invitation_rsvps
SET guest_name_normalized = LOWER(TRIM(guest_name));

ALTER TABLE invitation_rsvps
    ALTER COLUMN guest_name_normalized SET NOT NULL;

CREATE UNIQUE INDEX uq_invitation_rsvp_guest_name
    ON invitation_rsvps (invitation_id, guest_name_normalized);
