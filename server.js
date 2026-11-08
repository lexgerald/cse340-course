import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import { testConnection } from './src/models/db.js';
import flash from './src/middleware/flash.js';
import {
    showOrganizationsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showOrganizationDetailsPage,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './src/controllers/organizations.js';
import { 
  showProjectsPage, 
  showProjectDetailsPage, 
  showNewProjectForm, 
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm 
} from './src/controllers/projects.js';
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
} from './src/controllers/categories.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'cse340-dev-secret-change-me';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================================================
// MIDDLEWARE — ORDER MATTERS
// ============================================================

// 1. Session FIRST — initializes req.session
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// 2. Flash SECOND — depends on req.session from above
app.use(flash);

// 3. Body parsers — needed for POST routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. Static files + view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// ============================================================
// ROUTES — AFTER all middleware
// ============================================================

// Home
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// Organizations
app.get('/organizations', showOrganizationsPage);
app.get('/new-organization', showNewOrganizationForm);
app.post('/new-organization', organizationValidation, processNewOrganizationForm);
app.get('/organization/:id', showOrganizationDetailsPage);
app.get('/edit-organization/:id', showEditOrganizationForm);
app.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Projects
app.get('/projects', showProjectsPage);
app.get('/project/:id', showProjectDetailsPage);
app.get('/new-project', showNewProjectForm);
app.post('/new-project', projectValidation, processNewProjectForm);
app.get('/edit-project/:id', showEditProjectForm);
app.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Categories
app.get('/categories', showCategoriesPage);
app.get('/category/:id', showCategoryDetailsPage);
app.get('/assign-categories/:projectId', showAssignCategoriesForm);
app.post('/assign-categories/:projectId', processAssignCategoriesForm);
app.get('/new-category', showNewCategoryForm);
app.post('/new-category', categoryValidation, processNewCategoryForm);
app.get('/edit-category/:id', showEditCategoryForm);
app.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Session secret: ${SESSION_SECRET === 'cse340-dev-secret-change-me' ? '⚠️  USING DEV DEFAULT' : '✅ configured'}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});