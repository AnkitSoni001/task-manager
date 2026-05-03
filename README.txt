================================================================================
                     TASKFLOW -- TEAM TASK MANAGER
================================================================================

A full-stack MERN (MongoDB, Express, React, Node.js) web application for
collaborative project and task management with role-based access control
(Admin & Member).


================================================================================
                              FEATURES
================================================================================

  * Authentication
    - JWT-based register and login
    - Password hashing with bcrypt (salt rounds: 10)
    - Persistent sessions via localStorage
    - Token auto-attached to all API requests via Axios interceptor

  * Dashboard
    - Real-time statistics: total, pending, in-progress, completed & overdue tasks
    - Recent activity feed (last 5 tasks)
    - Role-aware stats (admins see all, members see own)

  * Projects
    - Create, edit, and delete projects (admin only)
    - Add and remove team members from projects
    - View tasks grouped by project
    - Creator is automatically added as a member

  * Tasks
    - Full CRUD operations (create, read, update, delete)
    - Assign tasks to team members
    - Priority levels: Low, Medium, High
    - Status tracking: Pending, In-Progress, Completed
    - Due dates with automatic overdue detection (virtual field)

  * Filtering
    - Filter tasks by project, status, and assignee via query parameters

  * Role-Based Access Control
    - Admin: full control over all resources
    - Member: scoped access to own projects/tasks, status-only updates

  * Responsive UI
    - Modern dark-themed interface
    - Sidebar navigation
    - Stat cards on the dashboard
    - Smooth transitions and hover effects

  * Production Ready
    - Single-server deployment
    - Express serves the React build in production mode
    - Catch-all route for client-side routing


================================================================================
                            TECH STACK
================================================================================

  FRONTEND
  --------
  Tool                        Version     Purpose
  --------------------------  ----------  ------------------------------------
  React                       19.1        UI library, component-based SPA
  React Router DOM             7.14        Client-side routing & protected routes
  Axios                        1.16        HTTP client with JWT interceptor
  Vite                         8.0         Dev server, HMR & production bundler
  @vitejs/plugin-react         4.6         React Fast Refresh for Vite
  Vanilla CSS                  --          Custom dark-theme design system

  BACKEND
  -------
  Tool                        Version     Purpose
  --------------------------  ----------  ------------------------------------
  Node.js                     >= 20.19    JavaScript runtime
  Express                      5.2         Web framework & REST API server
  MongoDB Atlas                Cloud       NoSQL database (hosted)
  Mongoose                     9.6         MongoDB ODM -- schemas, validation, virtuals
  JSON Web Token (jsonwebtoken) 9.0        Stateless authentication
  bcryptjs                     3.0         Password hashing (salt + hash)
  cors                         2.8         Cross-Origin Resource Sharing
  dotenv                      17.4         Environment variable management
  Nodemon                      3.1         Auto-restart dev server on file changes


================================================================================
                          PROJECT STRUCTURE
================================================================================

  task-manager/
  |
  |-- package.json                    Root scripts: install-all, build, start, dev
  |-- .gitignore
  |
  |-- backend/
  |   |-- server.js                   Express app entry -- middleware, routes, static
  |   |-- package.json                Backend dependencies
  |   |-- .env                        Environment variables (not committed)
  |   |
  |   |-- config/
  |   |   +-- db.js                   MongoDB Atlas connection with DNS fallback
  |   |
  |   |-- models/
  |   |   |-- User.js                 User schema -- name, email, password, role
  |   |   |-- Project.js              Project schema -- name, description, members
  |   |   +-- Task.js                 Task schema -- title, status, priority, dueDate
  |   |
  |   |-- controllers/
  |   |   |-- authController.js       Register, login, profile, list users
  |   |   |-- projectController.js    CRUD projects, add/remove members
  |   |   +-- taskController.js       CRUD tasks, dashboard stats, role-based logic
  |   |
  |   |-- middleware/
  |   |   +-- authMiddleware.js       JWT verification (protect) & admin-only guard
  |   |
  |   +-- routes/
  |       |-- authRoutes.js           /api/auth/*
  |       |-- projectRoutes.js        /api/projects/*
  |       +-- taskRoutes.js           /api/tasks/*
  |
  +-- frontend/
      |-- index.html                  HTML entry point with SEO meta tags
      |-- vite.config.js              Vite config -- dev proxy to backend :5000
      |-- package.json                Frontend dependencies
      |
      +-- src/
          |-- main.jsx                React root -- BrowserRouter + AuthProvider
          |-- App.jsx                 Route definitions & layout
          |-- index.css               Global dark-theme design system
          |
          |-- api/
          |   +-- axios.js            Axios instance with baseURL & JWT interceptor
          |
          |-- context/
          |   +-- AuthContext.jsx      Auth state provider -- user, login(), logout()
          |
          |-- components/
          |   |-- Navbar.jsx          Top navigation bar with user info & logout
          |   |-- Sidebar.jsx         Side nav -- Dashboard, Projects, Tasks
          |   |-- ProtectedRoute.jsx  Auth guard wrapper for private routes
          |   |-- StatCard.jsx        Dashboard statistic card component
          |   |-- TaskCard.jsx        Task display card with status/priority badges
          |   +-- TaskForm.jsx        Create/edit task form with dropdowns
          |
          +-- pages/
              |-- LoginPage.jsx           Login form
              |-- RegisterPage.jsx        Registration form with role selection
              |-- DashboardPage.jsx       Stats overview + recent tasks
              |-- ProjectsPage.jsx        Project list + create project (admin)
              |-- ProjectDetailPage.jsx   Project view + member & task management
              +-- TasksPage.jsx           All tasks with filters + create modal


================================================================================
                          GETTING STARTED
================================================================================

  PREREQUISITES
  -------------
  * Node.js >= 20.19.0
  * npm (bundled with Node.js)
  * MongoDB Atlas account (free tier works)
    Create a cluster at: https://www.mongodb.com/atlas/database


  INSTALLATION
  ------------
  1. Clone the repository:

     git clone https://github.com/AnkitSoni001/task-manager.git
     cd task-manager

  2. Install all dependencies (backend + frontend):

     npm run install-all


  ENVIRONMENT VARIABLES
  ---------------------
  Create a file named ".env" inside the "backend/" directory with the following:

     PORT=5000
     MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
     JWT_SECRET=your_super_secret_jwt_key
     NODE_ENV=development

  Variable        Description
  --------------  -----------------------------------------------------------
  PORT            Server port (default: 5000)
  MONGO_URI       MongoDB Atlas connection string
  JWT_SECRET      Secret key for signing JWT tokens
  NODE_ENV        "development" or "production"

  Note: The frontend uses VITE_API_URL (optional). In development, Vite
  proxies /api requests to http://localhost:5000. In production, the backend
  serves the frontend build directly.


  RUNNING LOCALLY
  ---------------
  Terminal 1 -- Start the backend dev server (with nodemon auto-reload):

     npm run dev

  Terminal 2 -- Start the frontend dev server:

     cd frontend
     npm run dev

  Service              URL
  -------------------  ----------------------------
  Frontend (Vite)      http://localhost:5173
  Backend API          http://localhost:5000


================================================================================
                           API ENDPOINTS
================================================================================

  AUTHENTICATION -- /api/auth
  ---------------------------
  Method   Endpoint              Access    Description
  ------   --------------------  --------  -----------------------------------
  POST     /api/auth/register    Public    Register a new user
  POST     /api/auth/login       Public    Login & receive JWT token
  GET      /api/auth/profile     Private   Get logged-in user's profile
  GET      /api/auth/users       Private   List all users (for dropdowns)

  PROJECTS -- /api/projects
  -------------------------
  Method   Endpoint                            Access    Description
  ------   ----------------------------------  --------  --------------------------
  POST     /api/projects                       Admin     Create a new project
  GET      /api/projects                       Private   List projects
  GET      /api/projects/:id                   Private   Get single project
  PUT      /api/projects/:id                   Admin     Update project
  DELETE   /api/projects/:id                   Admin     Delete project & its tasks
  POST     /api/projects/:id/members           Admin     Add member to project
  DELETE   /api/projects/:id/members/:userId   Admin     Remove member from project

  TASKS -- /api/tasks
  -------------------
  Method   Endpoint              Access    Description
  ------   --------------------  --------  ------------------------------------
  POST     /api/tasks            Private   Create a new task
  GET      /api/tasks            Private   List tasks (filters: ?project=
                                           &status= &assignedTo=)
  GET      /api/tasks/dashboard  Private   Get dashboard stats & recent tasks
  GET      /api/tasks/:id        Private   Get single task details
  PUT      /api/tasks/:id        Private   Update task (admin: all fields,
                                           member: status only)
  DELETE   /api/tasks/:id        Admin     Delete a task


================================================================================
                            DATA MODELS
================================================================================

  USER
  ----
  Field        Type                Notes
  -----------  ------------------  ------------------------------------------
  name         String              Required
  email        String              Required, unique, lowercase
  password     String              Required, min 6 chars, hashed with bcrypt
  role         String              "admin" or "member" (default: "member")
  createdAt    Date                Auto-generated by Mongoose
  updatedAt    Date                Auto-generated by Mongoose

  PROJECT
  -------
  Field        Type                Notes
  -----------  ------------------  ------------------------------------------
  name         String              Required
  description  String              Default: ""
  createdBy    ObjectId -> User    Required
  members      [ObjectId -> User]  Creator is auto-added on creation
  createdAt    Date                Auto-generated by Mongoose
  updatedAt    Date                Auto-generated by Mongoose

  TASK
  ----
  Field        Type                Notes
  -----------  ------------------  ------------------------------------------
  title        String              Required
  description  String              Default: ""
  status       String              "pending" | "in-progress" | "completed"
                                   (default: "pending")
  priority     String              "low" | "medium" | "high"
                                   (default: "medium")
  dueDate      Date                Optional
  project      ObjectId -> Project Required
  assignedTo   ObjectId -> User    Optional
  createdBy    ObjectId -> User    Required
  isOverdue    Boolean (virtual)   true if past due & not completed
  createdAt    Date                Auto-generated by Mongoose
  updatedAt    Date                Auto-generated by Mongoose


================================================================================
                      ROLE-BASED ACCESS CONTROL
================================================================================

  Action                          Admin         Member
  ------------------------------  ------------  ---------------------------
  Register / Login                Yes           Yes
  View dashboard stats            All tasks     Own project tasks only
  Create project                  Yes           No
  Edit / Delete project           Yes           No
  Add / Remove project members    Yes           No
  View projects                   All           Joined only
  Create task                     Any project   Own projects only
  Assign task to others           Yes           No
  Update task (all fields)        Yes           No
  Update task status              Yes           Own tasks only
  Delete task                     Yes           No


================================================================================
                            DEPLOYMENT
================================================================================

  This app is configured for single-server deployment on platforms like
  Railway, Render, or Heroku.

  BUILD & START COMMANDS
  ----------------------

     # Install dependencies
     npm run install-all

     # Build the frontend
     npm run build

     # Start the production server
     npm start

  In production (NODE_ENV=production), the Express server serves the React
  build from "frontend/dist/" and handles client-side routing with a
  catch-all route.

  RAILWAY DEPLOYMENT
  ------------------
  1. Push your code to GitHub
  2. Create a new project on Railway (https://railway.app/)
  3. Connect your GitHub repository
  4. Set environment variables:
     - MONGO_URI
     - JWT_SECRET
     - NODE_ENV=production
  5. Set build command:  npm run install-all && npm run build
  6. Set start command:  npm start

