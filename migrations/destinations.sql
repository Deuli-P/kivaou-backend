CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY,
    name TEXT,
    organization_id UUID,
    service_type service_type,
    service_link TEXT,
    schedule JSONB,
    address_id UUID,
    photo_path TEXT,
    google_page_link TEXT,
    speciality TEXT,
    phone TEXT,
    website TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID
);