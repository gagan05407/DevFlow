# DevFlow — Full-Stack Developer Productivity Platform

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-2.0-4285F4?logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)

DevFlow is a full-stack **Developer Productivity Platform** designed to help software engineers, technical leads, and developers track projects, delegate tasks, monitor GitHub repositories, and visualize real-time sprint productivity metrics with rich ambient animations.

---

## 🌟 Key Features

- 🌟 **Google OAuth 2.0 Sign-In**: 1-click Sign in with Google with automatic Google profile picture/avatar sync.
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

### Backend
- **Runtime**: Node.js & Express.js REST API
- **ORM**: Prisma ORM (v5)
- **Database Engine**: PostgreSQL
- **Authentication**: JWT & `google-auth-library`
- **Environment**: `dotenv`

---

## 🚀 Step-by-Step Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/DevFlow.git
cd DevFlow
```

### 2. Configure Environment Variables
- Create `server/.env`:
  ```env
  PORT=5000
  DATABASE_URL="postgresql://postgres:password@localhost:5432/devflow_db?schema=public"
  JWT_SECRET="devflow_super_secret_jwt_key_2026"
  GOOGLE_CLIENT_ID="your_google_client_id_here"
  ```
- Create `client/.env`:
  ```env
  REACT_APP_GOOGLE_CLIENT_ID="your_google_client_id_here"
  ```

### 3. Install Dependencies & Run Database Migrations
```bash
# Setup Server
cd server
npm install
npx prisma db push

# Setup Client
cd ../client
npm install
```

### 4. Start Development Servers
```bash
# Server
cd server && npm run dev

# Client
cd client && npm start
```

---

