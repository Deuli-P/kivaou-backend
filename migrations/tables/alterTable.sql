-- users.sql --------
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_auth_id') THEN
        ALTER TABLE users ADD CONSTRAINT fk_auth_id FOREIGN KEY (auth_id) REFERENCES auth(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_organization_id') THEN
        ALTER TABLE users ADD CONSTRAINT fk_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_deleted_id') THEN
        ALTER TABLE users ADD CONSTRAINT fk_deleted_id FOREIGN KEY (deleted_by) REFERENCES users(id);
    END IF;
END $$;

-- address.sql --------
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_created_id_address') THEN
        ALTER TABLE address ADD CONSTRAINT fk_created_id_address FOREIGN KEY (created_by) REFERENCES users(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_deleted_id_address') THEN
        ALTER TABLE address ADD CONSTRAINT fk_deleted_id_address FOREIGN KEY (deleted_by) REFERENCES users(id);
    END IF;
END $$;

-- organizations.sql --------
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_owner_id') THEN
        ALTER TABLE organizations ADD CONSTRAINT fk_owner_id FOREIGN KEY (owner_id) REFERENCES users(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_created_id_organizations') THEN
        ALTER TABLE organizations ADD CONSTRAINT fk_created_id_organizations FOREIGN KEY (created_by) REFERENCES users(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_deleted_id_organizations') THEN
        ALTER TABLE organizations ADD CONSTRAINT fk_deleted_id_organizations FOREIGN KEY (deleted_by) REFERENCES users(id);
    END IF;
END $$;

-- destinations.sql --------
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_organization_id_destinations') THEN
        ALTER TABLE destinations ADD CONSTRAINT fk_organization_id_destinations FOREIGN KEY (organization_id) REFERENCES organizations(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_address_id_destinations') THEN
        ALTER TABLE destinations ADD CONSTRAINT fk_address_id_destinations FOREIGN KEY (address_id) REFERENCES address(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_created_id_destinations') THEN
        ALTER TABLE destinations ADD CONSTRAINT fk_created_id_destinations FOREIGN KEY (created_by) REFERENCES users(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_deleted_id_destinations') THEN
        ALTER TABLE destinations ADD CONSTRAINT fk_deleted_id_destinations FOREIGN KEY (deleted_by) REFERENCES users(id);
    END IF;
END $$;

-- events.sql --------
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_organization_id_events') THEN
        ALTER TABLE events ADD CONSTRAINT fk_organization_id_events FOREIGN KEY (organization_id) REFERENCES organizations(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_destinations_id_events') THEN
        ALTER TABLE events ADD CONSTRAINT fk_destinations_id_events FOREIGN KEY (destinations_id) REFERENCES destinations(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_created_id_events') THEN
        ALTER TABLE events ADD CONSTRAINT fk_created_id_events FOREIGN KEY (created_by) REFERENCES users(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_deleted_id_events') THEN
        ALTER TABLE events ADD CONSTRAINT fk_deleted_id_events FOREIGN KEY (deleted_by) REFERENCES users(id);
    END IF;
END $$;

-- submits.sql --------
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_event_id_submits') THEN
        ALTER TABLE submits ADD CONSTRAINT fk_event_id_submits FOREIGN KEY (event_id) REFERENCES events(id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_user_id_submits') THEN
        ALTER TABLE submits ADD CONSTRAINT fk_user_id_submits FOREIGN KEY (user_id) REFERENCES users(id);
    END IF;
END $$;