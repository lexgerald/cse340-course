import { getAllCategories, getCategoryDetails, getProjectsForCategory } from '../models/categories.js';

// (existing) categories list page — no changes needed
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', {
            title: 'Service Categories',
            categories
        });
    } catch (error) {
        next(error);
    }
};

// NEW: category details page
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await getCategoryDetails(id);
        if (!category) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }

        const projects = await getProjectsForCategory(id);

        res.render('category', {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        next(error);
    }
};

export { showCategoriesPage, showCategoryDetailsPage };