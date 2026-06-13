![CI](https://github.com/mimirx/Job-Stats/actions/workflows/ci.yml/badge.svg)
![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![API](https://img.shields.io/badge/API-Express-lightgrey)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Frontend Hosting](https://img.shields.io/badge/Frontend-Vercel-black)
![Backend Hosting](https://img.shields.io/badge/Backend-Render-purple)
![Database Hosting](https://img.shields.io/badge/Database-Neon-green)

# Job Stats

Job Stats is a full-stack web application for tracking job applications from first contact to offer. Users can manage applications, schedule interviews, view analytics, and get AI-generated insights about their job search — all in one place.

Built as a portfolio project to demonstrate real-world full-stack development skills across React, Node.js, Express, and PostgreSQL, deployed across multiple cloud services.

---

# Live Demo

https://job-stats-iota.vercel.app

### Demo Account

Email: demo1@demo.com  
Password: demopass188!

---

# Features

### User Authentication
- Register and login with JWT authentication
- Protected routes — unauthenticated users are redirected to login
- Rate limiting on auth endpoints (10 requests per 15 minutes)
- Input validation with express-validator

### Application Tracking
- Create, edit, and delete job applications
- Server-side filtering by status and keyword search (ILIKE)
- Sorting by date added, date applied, company, position, or salary
- Paginated results (10 per page) with total count
- Activity log per application — automatically records status changes

### Kanban Board
- Drag-and-drop board view organized by status (Applied, Interview, Offer, Rejected)
- Optimistic UI updates — the board moves instantly, syncs in the background
- Toggle between list and board view

### Interview Scheduling
- Schedule interviews linked to applications with date, time, and type
- Categorize by type: Phone, Technical, Onsite, Final, Other
- Timeline view split into upcoming and past interviews

### Analytics
- Status breakdown (doughnut and bar charts via Chart.js)
- Weekly application trend (line chart)
- Response rate and average salary target
- All stats computed via SQL aggregations on the server

### AI Insights
- One-click AI analysis of job search data powered by Google Gemini
- Streaming response — text appears word-by-word in real time
- Covers: overall assessment, what's working, areas to improve, action plan
- Rate limited to 5 requests per 15 minutes

### Dark Mode
- Full dark/light theme toggle
- Preference persisted in localStorage
- Implemented with CSS custom properties and a React context

### CSV Export
- Export all applications to a `.csv` file with one click
- Client-side generation via Blob API — no server round-trip

### Quality
- 16 backend tests covering auth, applications CRUD, and stats (Jest + Supertest)
- GitHub Actions CI — tests run automatically on every push to main

---

# Tech Stack

## Frontend
- React 18 + Vite
- Framer Motion (page transitions, staggered animations)
- Chart.js + react-chartjs-2
- React Router v6
- Custom CSS with CSS variables for theming

## Backend
- Node.js + Express 5
- JWT authentication (jsonwebtoken + bcrypt)
- express-validator for input validation
- express-rate-limit for rate limiting
- @google/generative-ai (Gemini API)

## Database
- PostgreSQL (Neon serverless)
- Raw SQL with parameterized queries (pg)
- SQL aggregations: COUNT GROUP BY, DATE_TRUNC, AVG

## Infrastructure
- Vercel — frontend hosting with SPA rewrites
- Render — backend hosting
- Neon — serverless PostgreSQL
- GitHub Actions — CI/CD pipeline

---

# Architecture

```
Browser
  ↓
React Frontend (Vercel)
  ↓
Node.js / Express REST API (Render)
  ↓
PostgreSQL Database (Neon)
        +
Google Gemini API (AI Insights)
```

---

# Project Structure

```
Job-Stats/
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   └── interviewController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validate.js
│   ├── models/
│   │   ├── activityModel.js
│   │   ├── applicationModel.js
│   │   ├── statsModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── insightsRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── statsRoutes.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── applications.test.js
│   │   └── stats.test.js
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── api/
│       │   └── api.js
│       ├── components/
│       │   ├── ActivityLog.jsx
│       │   ├── KanbanView.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── Skeleton.jsx
│       ├── context/
│       │   └── ThemeContext.jsx
│       ├── pages/
│       │   ├── AnalyticsPage.jsx
│       │   ├── ApplicationsPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── InsightsPage.jsx
│       │   ├── InterviewsPage.jsx
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   └── RegisterPage.jsx
│       ├── utils/
│       │   └── exportCsv.js
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
└── database/
    └── init.sql
```

---

# API Endpoints

All endpoints except `/auth` require a `Authorization: Bearer <token>` header.

## Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account, returns user object |
| POST | `/auth/login` | Authenticate, returns JWT token |

## Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/applications` | List applications (filterable, sortable, paginated) |
| POST | `/applications` | Create application |
| PUT | `/applications/:id` | Update application |
| DELETE | `/applications/:id` | Delete application |
| GET | `/applications/:id/activity` | Get activity log for an application |

## Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Status breakdown, weekly trend, response rate, avg salary |

## Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/interviews` | List interviews (joined with application data) |
| POST | `/interviews` | Schedule an interview |
| PUT | `/interviews/:id` | Update interview |
| DELETE | `/interviews/:id` | Delete interview |

## Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/insights` | Stream AI analysis of job search data (Gemini) |

---

# Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/mimirx/Job-Stats.git
cd Job-Stats
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Set up the frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Run tests
```bash
cd backend
npm test
```

---

# Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `GEMINI_API_KEY` | Google AI Studio API key (free tier) |
| `PORT` | Server port (default 5000) |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

# Author

Miro Marinov  
Bachelor of Science – Computer Science (Software Development)  
Lewis University

---

# License

This project is intended for educational and portfolio purposes.
