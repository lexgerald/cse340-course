import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import { testConnection } from './src/models/db.js';
import flash from './src/middleware/flash.js';
import router from './src/routes.js';

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

// 3. Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. Static files + view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 5. Locals for views — MUST come AFTER session (depends on req.session.user)
//    but BEFORE routes (so every render has access)
app.use((req, res, next) => {
    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
    }

    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// ============================================================
// ROUTES — delegated to src/routes.js
// ============================================================
app.use('/', router);

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