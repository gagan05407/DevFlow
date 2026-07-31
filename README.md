# DevFlow — Full-Stack Developer Productivity Platform

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-2.0-4285F4?logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/API-Render-46E3B7?logo=render&logoColor=white)

DevFlow is a full-stack **Developer Productivity Platform** designed to help software engineers, technical leads, and developers track projects, delegate tasks, monitor live GitHub repositories, and visualize real-time sprint productivity metrics with rich ambient animations.

---

## 🌐 Live Production Application

- **🚀 Live Application (Frontend)**: [https://dev-flow-kappa-three.vercel.app](https://dev-flow-kappa-three.vercel.app)
- **⚙️ Live REST API (Backend)**: [https://devflow-backend-9bfd.onrender.com](https://devflow-backend-9bfd.onrender.com)
- **🗄️ Cloud Database**: Serverless PostgreSQL hosted on [Neon.tech](https://neon.tech)
- **🐙 GitHub Repository**: [https://github.com/gagan05407/DevFlow](https://github.com/gagan05407/DevFlow)

---

## 🌟 Key Features

- 🌟 **Google OAuth 2.0 Sign-In**: 1-click Sign in with Google with automatic Google profile picture/avatar sync across Navbar, Sidebar, and Profile settings.
- 👑 **Role-Based Task Delegation**: Team Leaders and Admins assign engineering tasks directly to accepted team members.
- 👥 **Multi-User Project Invites**: Invite teammates by email, receive interactive Navbar notifications, and accept/decline project invitations.
- 🐙 **Live GitHub Repo Integration**: Display live **Stars ⭐️**, **Open Issues 🐛**, **Primary Language 🏷️**, and direct links on project cards via the GitHub REST API.
- 🎉 **Task Completion Confetti**: Celebratory particle explosion whenever tasks are marked as **COMPLETED**.
- 🌌 **Interactive Particle Constellation**: 60fps Canvas particle web background that reacts dynamically to mouse movement.
- 🔔 **Glowing Dark Toasts**: Sleek `react-hot-toast` popups for all user actions with dark glassmorphism styling.
- 🗑️ **Account Deletion**: Danger Zone setting in Profile with safety confirmation modal to permanently delete user data.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (JavaScript)
- **UI & Icons**: Material UI (MUI v5)
- **Animations**: Framer Motion, HTML5 Canvas 2D, Canvas-Confetti
- **Notifications**: `react-hot-toast`
- **OAuth**: `@react-oauth/google`
- **Deployment**: Vercel (`dev-flow-kappa-three.vercel.app`)

### Backend
- **Runtime**: Node.js & Express.js REST API
- **ORM**: Prisma ORM (v5)
- **Database Engine**: Serverless PostgreSQL (Neon)
- **Authentication**: JWT & `google-auth-library`
- **Environment**: `dotenv`
- **Deployment**: Render (`devflow-backend-9bfd.onrender.com`)

---

## 🏗️ Architecture & Data Flow

```text
[ React 18 Frontend (https://dev-flow-kappa-three.vercel.app) ] 
       │
       ▼ Axios HTTP Client (Bearer JWT Token)
[ Express.js REST API (https://devflow-backend-9bfd.onrender.com) ]
       │
       ▼ Middleware (JWT Protect, RBAC Guard & Input Validation)
[ Controllers (Auth, Project, Task, Invite, Dashboard) ]
       │
       ▼ Prisma ORM Client Singleton
[ Serverless PostgreSQL Database Engine (Neon.tech) ]
```

---

## 🚀 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/gagan05407/DevFlow.git
cd DevFlow
```

### 2. Configure Environment Variables
- `server/.env`:
  ```env
  PORT=5000
  DATABASE_URL="postgresql://neondb_owner:npg_uARF6f3ZPMkg@ep-delicate-unit-axptuo9b.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"
  JWT_SECRET="devflow_super_secret_jwt_key_2026"
  GOOGLE_CLIENT_ID="688624054880-g7n8n0qf6bnl1jvcak785u6aoadle1i1.apps.googleusercontent.com"
  ```
- `client/.env`:
  ```env
  REACT_APP_API_URL="https://devflow-backend-9bfd.onrender.com/api"
  REACT_APP_GOOGLE_CLIENT_ID="688624054880-g7n8n0qf6bnl1jvcak785u6aoadle1i1.apps.googleusercontent.com"
  ```

### 3. Install Dependencies & Run Database Schema Sync
```bash
# Backend Setup
cd server
npm install
npx prisma db push

# Frontend Setup
cd ../client
npm install
```

### 4. Start Local Development Servers
```bash
# Start Backend API
cd server && npm run dev

# Start Frontend React App
cd client && npm start
```
