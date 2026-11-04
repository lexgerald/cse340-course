import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';
import { showProjectsPage, showProjectDetailsPage } from './src/controllers/projects.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Home
app.get('/', async (req, res) => {
    res.render('home', { title: 'Home' });
});

// Organizations
app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('organizations', {
        title: 'Our Partner Organizations',
        organizations
    });
});

// Projects (upcoming list) — uses controller
app.get('/projects', showProjectsPage);

// Project (single details page) — uses controller
app.get('/project/:id', showProjectDetailsPage);

// Categories
app.get('/categories', async (req, res) => {
    const categories = await getAllCategories();
    res.render('categories', {
        title: 'Service Categories',
        categories
    });
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});