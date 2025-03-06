-- users.sql --------
ALTER TABLE users
ADD CONSTRAINT fk_auth_id FOREIGN KEY (auth_id) REFERENCES auth(id);


ALTER TABLE users
ADD CONSTRAINT fk_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


ALTER TABLE users
ADD CONSTRAINT fk_deleted_id FOREIGN KEY (deleted_by) REFERENCES users(id);


-- address.sql --------
ALTER TABLE address
ADD CONSTRAINT fk_created_id FOREIGN KEY (created_by) REFERENCES users(id);


ALTER TABLE address
ADD CONSTRAINT fk_deleted_id FOREIGN KEY (deleted_by) REFERENCES users(id);


-- organizations.sql --------

ALTER TABLE organizations
ADD CONSTRAINT fk_owner_id FOREIGN KEY (owner) REFERENCES users(id);


ALTER TABLE organizations
ADD CONSTRAINT fk_created_id FOREIGN KEY (created_by) REFERENCES users(id);


ALTER TABLE organizations
ADD CONSTRAINT fk_deleted_id FOREIGN KEY (deleted_by) REFERENCES users(id);


-- destinations.sql --------
ALTER TABLE destinations
ADD CONSTRAINT fk_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


ALTER TABLE destinations
ADD CONSTRAINT fk_address_id FOREIGN KEY (address_id) REFERENCES address(id);


ALTER TABLE destinations
ADD CONSTRAINT fk_created_id FOREIGN KEY (created_by) REFERENCES users(id);


ALTER TABLE destinations
ADD CONSTRAINT fk_deleted_id FOREIGN KEY (deleted_by) REFERENCES users(id);



-- events.sql --------
ALTER TABLE events
ADD CONSTRAINT fk_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


ALTER TABLE events
ADD CONSTRAINT fk_destinations_id FOREIGN KEY (destinations_id) REFERENCES destinations(id);


ALTER TABLE events
ADD CONSTRAINT fk_created_id FOREIGN KEY (created_by) REFERENCES users(id);


ALTER TABLE events
ADD CONSTRAINT fk_deleted_id FOREIGN KEY (deleted_by) REFERENCES users(id);


-- submits.sql --------
ALTER TABLE submits
ADD CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES events(id);


ALTER TABLE submits
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);
