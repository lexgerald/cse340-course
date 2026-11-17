import db from './db.js';

/**
 * Add a user as a volunteer for a project.
 * Safe to call if already volunteering — no-op thanks to ON CONFLICT.
 */
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
    await db.query(query, [userId, projectId]);
};

/**
 * Remove a user as a volunteer for a project.
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    await db.query(query, [userId, projectId]);
};

/**
 * True if the given user is volunteering for the given project.
 */
const isVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

/**
 * All projects the user has volunteered for.
 * Returns project details + organization name, ordered by project date.
 */
const getProjectsForUser = async (userId) => {
    const query = `
        SELECT sp.project_id,
               sp.title,
               sp.description,
               sp.project_date AS date,
               sp.location,
               sp.organization_id,
               o.name AS organization_name,
               pv.created_at AS volunteered_at
        FROM project_volunteer pv
        JOIN service_project sp ON sp.project_id = pv.project_id
        JOIN organization o ON o.organization_id = sp.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.project_date ASC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export {
    addVolunteer,
    removeVolunteer,
    isVolunteering,
    getProjectsForUser
};