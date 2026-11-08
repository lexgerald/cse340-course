import {
    getAllCategories,
    getCategoryDetails,
    getProjectsForCategory,
    getCategoriesForProject,      
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Service Categories', categories });
    } catch (error) {
        next(error);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await getCategoryDetails(id);
        if (!category) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }
        const projects = await getProjectsForCategory(id);
        res.render('category', { title: category.name, category, projects });
    } catch (error) {
        next(error);
    }
};

// NEW — show the checkbox form
const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const projectDetails = await getProjectDetails(projectId);
        if (!projectDetails) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesForProject(projectId);

        res.render('assign-categories', {
            title: 'Assign Categories to Project',
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (error) {
        next(error);
    }
};

// NEW — process the form submission
const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const selectedCategoryIds = req.body.categoryIds || [];
        const categoryIdsArray = Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIdsArray);

        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

const showNewCategoryForm = async (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

const processNewCategoryForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect('/new-category');
        }

        const { name } = req.body;
        const newCategoryId = await createCategory(name);

        req.flash('success', 'Category created successfully!');
        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'A category with that name already exists.');
            return res.redirect('/new-category');
        }
        next(error);
    }
};

const showEditCategoryForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const categoryDetails = await getCategoryDetails(id);
        if (!categoryDetails) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }
        res.render('edit-category', {
            title: `Edit ${categoryDetails.name}`,
            categoryDetails
        });
    } catch (error) {
        next(error);
    }
};

const processEditCategoryForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect(`/edit-category/${req.params.id}`);
        }

        const { id } = req.params;
        const { name } = req.body;
        await updateCategory(id, name);

        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${id}`);
    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'A category with that name already exists.');
            return res.redirect(`/edit-category/${req.params.id}`);
        }
        next(error);
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};