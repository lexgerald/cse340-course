import db from './db.js';

// (existing) get all categories
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM category
        ORDER BY name;
    `;
    const result = await db.query(query);
    return result.rows;
};

// NEW: retrieve a single category by its ID
const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// NEW: retrieve all categories for a given service project
const getCategoriesForProject = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM category c
        JOIN project_category pc ON pc.category_id = c.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

// NEW: retrieve all service projects for a given category
const getProjectsForCategory = async (categoryId) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.description,
               sp.project_date AS date, sp.location,
               sp.organization_id, o.name AS organization_name
        FROM service_project sp
        JOIN project_category pc ON pc.project_id = sp.project_id
        JOIN organization o ON o.organization_id = sp.organization_id
        WHERE pc.category_id = $1
        ORDER BY sp.project_date ASC;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

export {
    getAllCategories,
    getCategoryDetails,
    getCategoriesForProject,
    getProjectsForCategory
};