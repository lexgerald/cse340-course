import express from 'express';
import {
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
} from './controllers/users.js'

// Organizations
import {
    showOrganizationsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showOrganizationDetailsPage,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

// Projects
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';

// Categories
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';

const router = express.Router();

// ============================================================
// HOME
// ============================================================
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Dashboard (protected)
router.get('/dashboard', requireLogin, showDashboard);

// Admin-only users page
router.get('/users', requireLogin, requireRole('admin'), showUsersPage);

// ============================================================
// ORGANIZATIONS
// ============================================================
router.get('/organizations', showOrganizationsPage);
router.get('/new-organization', requireLogin, requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireLogin, requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/edit-organization/:id', requireLogin, requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireLogin, requireRole('admin'), organizationValidation, processEditOrganizationForm);

// ============================================================
// PROJECTS
// ============================================================
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', requireLogin, requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireLogin, requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireLogin, requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireLogin, requireRole('admin'), projectValidation, processEditProjectForm);

// ============================================================
// CATEGORIES
// ============================================================
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/assign-categories/:projectId', requireLogin, requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireLogin, requireRole('admin'), processAssignCategoriesForm);
router.get('/new-category', requireLogin, requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireLogin, requireRole('admin'), categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireLogin, requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireLogin, requireRole('admin'), categoryValidation, processEditCategoryForm);

export default router;