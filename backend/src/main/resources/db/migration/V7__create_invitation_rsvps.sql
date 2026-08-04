CREATE TABLE invitation_rsvps (
    id UUID PRIMARY KEY,
    invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    guest_name VARCHAR(120) NOT NULL,
    guest_count INTEGER NOT NULL CHECK (guest_count BETWEEN 1 AND 20),
    attending BOOLEAN NOT NULL,
    message VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_invitation_rsvps_invitation_id ON invitation_rsvps(invitation_id);
