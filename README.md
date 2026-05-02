# TaskFlow — Team Task Manager

A full-stack collaborative task management application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Features role-based access control (Admin/Member), project management, task assignment, and a dashboard with overdue tracking.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)

---

## ✨ Features

### 🔐 Authentication
- User registration & login with JWT
- Role-based access control (Admin / Member)
- Protected API routes

### 📁 Project Management
- Create, edit, and delete projects (Admin)
- Add/remove team members to projects
- View projects you belong to

### ✅ Task Management
- Create tasks within projects
- Assign tasks to team members
- Set priority (Low / Medium / High)
- Set due dates with overdue detection
- Update status: Pending → In Progress → Completed
- Filter tasks by status and project

### 📊 Dashboard
- Total, Pending, In Progress, Completed, Overdue task counts
- Recent tasks overview
- Role-specific data visibility

### 👥 Role-Based Access

| Action | Admin | Member |
|--------|:-----:|:------:|
| Create/delete projects | ✅ | ❌ |
| Manage team members | ✅ | ❌ |
| Create tasks | ✅ | ✅ |
| Assign tasks to others | ✅ | ❌ |
| Update own task status | ✅ | ✅ |
| Delete tasks | ✅ | ❌ |
| View dashboard | ✅ | ✅ |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| Styling | Vanilla CSS (Dark theme, Glassmorphism) |

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, Profile
│   │   ├── projectController.js # Project CRUD + members
│   │   └── taskController.js  # Task CRUD + dashboard stats
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js            # User schema (name, email, password, role)
│   │   ├── Project.js         # Project schema (name, members)
│   │   └── Task.js            # Task schema (title, status, priority, dueDate)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express entry point
│
└── frontend/
    ├── src/
    │   ├── api/axios.js       # Axios instance with JWT interceptor
    │   ├── components/        # Navbar, Sidebar, TaskCard, TaskForm, etc.
    │   ├── context/AuthContext.jsx  # Auth state management
    │   ├── pages/             # Login, Register, Dashboard, Projects, Tasks
    │   ├── App.jsx            # Routes & layout
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Design system
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`):
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### 4. Open the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/profile` | Private | Get user profile |
| GET | `/api/auth/users` | Private | List all users |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects` | Private | List projects |
| GET | `/api/projects/:id` | Private | Get project details |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project + tasks |
| POST | `/api/projects/:id/members` | Admin | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Admin | Remove member |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/tasks` | Private | Create task |
| GET | `/api/tasks` | Private | List tasks (with filters) |
| GET | `/api/tasks/dashboard` | Private | Dashboard statistics |
| GET | `/api/tasks/:id` | Private | Get single task |
| PUT | `/api/tasks/:id` | Private | Update task |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

---

## 🚢 Deployment (Railway)

1. Push code to GitHub
2. Create a Railway project at [railway.app](https://railway.app)
3. Add backend service from your repo (root: `backend/`)
4. Set environment variables in Railway: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `PORT`
5. For frontend: build locally (`npm run build` in frontend/) and let backend serve it, OR deploy as separate service
6. Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

---

## 📝 License

MIT
