# TaskFlow — Team Task Manager

A full-stack collaborative task management application built with the MERN stack. Enables teams to create projects, assign tasks, and track progress with role-based access control.

**Live Demo:** [task-manager-production-0422.up.railway.app](https://task-manager-production-0422.up.railway.app)

---

## Features

- **Authentication** — Secure JWT-based signup/login with role selection (Admin/Member)
- **Project Management** — Create, update, and delete projects with team member management
- **Task Tracking** — Full task lifecycle with status (Pending → In Progress → Completed), priority levels (Low/Medium/High), due dates, and overdue detection
- **Role-Based Access Control** — Admins manage projects and assign tasks; Members update their own task status
- **Dashboard** — Real-time overview with task statistics, overdue counts, and recent activity
- **Responsive Design** — Works across desktop and mobile devices

### Role-Based Access

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

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Authentication | JWT, bcryptjs |
| Deployment | Railway |

---

## Project Structure

```
task-manager/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers (auth, projects, tasks)
│   ├── middleware/       # JWT authentication & role guards
│   ├── models/          # Mongoose schemas (User, Project, Task)
│   ├── routes/          # API route definitions
│   └── server.js        # Express application entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios instance with JWT interceptor
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Authentication state management
│   │   └── pages/       # Application views
│   └── index.html
│
└── package.json         # Root scripts for build & deployment
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/profile` | Get current user profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create project (Admin) |
| GET | `/api/projects` | List all projects |
| PUT | `/api/projects/:id` | Update project (Admin) |
| DELETE | `/api/projects/:id` | Delete project (Admin) |
| POST | `/api/projects/:id/members` | Add team member (Admin) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | List tasks (with filters) |
| GET | `/api/tasks/dashboard` | Dashboard statistics |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task (Admin) |

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas account

### Installation

```bash
git clone https://github.com/AnkitSoni001/task-manager.git
cd task-manager
```

**Backend:**
```bash
cd backend
npm install
```

Create `backend/.env` using the template in `.env.example`:
```
MONGO_URI=<your_mongodb_connection_string>
PORT=5000
JWT_SECRET=<your_secret_key>
NODE_ENV=development
```

**Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
```

### Running Locally

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open `http://localhost:5173` in your browser.
