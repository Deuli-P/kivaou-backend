CREATE TABLE IF NOT EXISTS submits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID,
    user_id UUID,
    status submit_status,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);