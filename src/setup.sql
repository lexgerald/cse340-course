-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Inserting data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_service_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Inserting data: Service Projects
-- ========================================
INSERT INTO service_project (organization_id, title, description, location, project_date)
VALUES
(1, 'Community Center Renovation', 'Repair and repaint the community center, including roofing and window upgrades.', 'Riverside Community Center', '2025-06-14'),
(1, 'Affordable Housing Build', 'Construct two energy-efficient homes for low-income families in partnership with local volunteers.', 'Eastside Neighborhood', '2025-07-05'),
(2, 'Urban Garden Workshop', 'Teach residents how to grow vegetables in small urban spaces and distribute starter kits.', 'Downtown Community Garden', '2025-05-20'),
(2, 'School Garden Installation', 'Install raised garden beds at an elementary school and run a planting day with students.', 'Lincoln Elementary School', '2025-08-22'),
(3, 'Food Drive Sorting Event', 'Sort and package donated food items for distribution to local food banks.', 'UnityServe Warehouse', '2025-04-12'),
(3, 'Park Cleanup Day', 'Clean up litter and plant native shrubs along the riverside park trail.', 'Riverside Park', '2025-09-13');