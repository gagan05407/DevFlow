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

- **🚀 Live Application (Frontend)**: [Live Demo](https://your-frontend-url.vercel.app)
- **⚙️ Live REST API (Backend)**: Hosted on Render
- **🗄️ Cloud Database**: Serverless PostgreSQL hosted on [Neon.tech](https://neon.tech)
- **🐙 GitHub Repository**: [Repository Link](https://github.com/your-username/DevFlow)

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
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js & Express.js REST API
- **ORM**: Prisma ORM (v5)
- **Database Engine**: Serverless PostgreSQL (Neon)
- **Authentication**: JWT & `google-auth-library`
- **Environment**: `dotenv`
- **Deployment**: Render

---

## 🏗️ Architecture & Data Flow

```text
[ React 18 Frontend ]
       │
       ▼ Axios HTTP Client (Bearer JWT Token)
[ Express.js REST API ]
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
git clone https://github.com/your-username/DevFlow.git
cd DevFlow
```

### 2. Configure Environment Variables

Create a `server/.env` file with the following keys (get values from your own Neon and Google Cloud Console dashboards — never commit real secrets):
```env
PORT=5000
DATABASE_URL="your_neon_postgresql_connection_string"
JWT_SECRET="your_own_strong_random_secret"
GOOGLE_CLIENT_ID="your_google_oauth_client_id"
```

Create a `client/.env` file with:
```env
REACT_APP_API_URL="your_backend_api_url/api"
REACT_APP_GOOGLE_CLIENT_ID="your_google_oauth_client_id"
```

> ⚠️ Add `.env` to `.gitignore` so these files are never pushed to GitHub.

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
