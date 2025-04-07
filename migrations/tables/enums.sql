CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        CREATE TYPE user_type AS ENUM ('admin', 'user');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_type') THEN
        CREATE TYPE service_type AS ENUM ('pub', 'restaurant', 'fast-food', 'escape-game', 'amusement-park', 'entertenment', 'theater', 'concert' );
    END IF;
END $$;
DO $$ 


BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
        CREATE TYPE event_status AS ENUM ( 'started', 'deleted', 'cancelled' );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submit_status') THEN
        CREATE TYPE submit_status AS ENUM ( 'register', 'cancelled', 'banned' );
    END IF;
END $$;