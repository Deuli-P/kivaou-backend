CREATE TABLE IF NOT EXISTS address (
    id UUID PRIMARY KEY,
    street_number TEXT,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    postale_code TEXT NOT NULL,
    longitude FLOAT,
    latitude FLOAT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID
);