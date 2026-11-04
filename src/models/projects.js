import db from './db.js';

const getAllServiceProjects = async () => {
    const query = `
        SELECT project_id, organization_id,
        title, description, location,
        project_date
        FROM public.service_project;
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieve the next N upcoming service projects (date >= today),
 * ordered by date ascending, limited to number_of_projects.
 *
 * @param {number} number_of_projects
 * @returns {Promise<Array>} array of project objects with organization_name
 */
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date AS date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON o.organization_id = sp.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1;
    `;
    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

/**
 * Retrieve a single service project by ID.
 *
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
const getProjectDetails = async (id) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date AS date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON o.organization_id = sp.organization_id
        WHERE sp.project_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export { getAllServiceProjects, getUpcomingProjects, getProjectDetails };