![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![API](https://img.shields.io/badge/API-Express-lightgrey)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Frontend Hosting](https://img.shields.io/badge/Frontend-Vercel-black)
![Backend Hosting](https://img.shields.io/badge/Backend-Render-purple)
![Database Hosting](https://img.shields.io/badge/Database-Neon-green)

# Job Stats

Job Stats is a full-stack web application that allows users to track job applications, monitor their progress through different stages, and analyze their job search using statistics and charts.

The platform provides a clean dashboard where users can manage applications, update statuses, and visualize their job search progress.

This project demonstrates a modern full-stack architecture using **React, Node.js, Express, and PostgreSQL** deployed across multiple cloud services.

---

# Live Demo

Frontend  
https://job-stats-iota.vercel.app

### Demo Account

Use the following credentials to explore the application:

Email: demo1@demo.com  
Password: demopass188!

---

# Features

### User Authentication
- Register account
- Login with JWT authentication
- Secure protected routes

### Application Tracking
- Create job applications
- Edit application details
- Delete applications
- Track application statuses

### Dashboard
- View job search overview
- See recent applications
- Quick summary statistics

### Analytics
- Visualize job search progress
- Chart-based statistics
- Application status breakdown

### Cloud Deployment
- Frontend deployed on Vercel
- Backend API deployed on Render
- PostgreSQL database hosted on Neon

---

# Tech Stack

## Frontend
- React
- Vite
- Chart.js
- Tailwind CSS

## Backend
- Node.js
- Express.js
- JWT Authentication
- REST API

## Database
- PostgreSQL
- Neon serverless database

## Infrastructure
- Vercel (Frontend hosting)
- Render (Backend hosting)
- Neon (Cloud PostgreSQL)
- GitHub (Version control)

---

# Architecture

Browser  
↓  
React Frontend (Vercel)  
↓  
Node.js / Express API (Render)  
↓  
PostgreSQL Database (Neon)

---

# Project Structure

job-stats
│
├── backend
│ ├── config
│ │ └── db.js
│ ├── controllers
│ ├── middleware
│ ├── routes
│ └── server.js
│
├── frontend
│ ├── src
│ │ ├── components
│ │ ├── pages
│ │ ├── services
│ │ └── App.jsx
│
├── database
│ └── schema.sql
│
├── docker-compose.yml
├── README.md
└── .gitignore


---

# API Endpoints

## Authentication

POST `/api/auth/register`  
Create a new user account

POST `/api/auth/login`  
Authenticate user and return JWT token

---

## Applications

GET `/api/applications`  
Retrieve all applications for the logged-in user

POST `/api/applications`  
Create a new job application

PUT `/api/applications/:id`  
Update application details

DELETE `/api/applications/:id`  
Remove an application

---

## Statistics

GET `/api/stats`  
Retrieve dashboard analytics data

---

# Running Locally

## 1 Clone repository
git clone https://github.com/mimirx/Job-Stats.git

cd Job-Stats

---

## 2 Start database
docker compose up

---

## 3 Start backend
cd backend
npm install
npm run dev

Backend will run on:
http://localhost:5000

---

## 4 Start frontend
cd frontend
npm install
npm run dev

Frontend will run on:
http://localhost:5173


---

# Environment Variables

### Backend `.env`
DATABASE_URL=your_database_connection
JWT_SECRET=your_secret_key

### Frontend `.env`
VITE_API_URL=http://localhost:5000

---

# Deployment

Frontend deployed on **Vercel**

Backend deployed on **Render**

Database hosted on **Neon PostgreSQL**

Automatic deployments are triggered through **GitHub pushes**.

---

# Future Improvements

Possible future enhancements:

- Resume upload for job applications
- Email notifications for status updates
- AI job search insights
- Calendar integration for interview scheduling
- Mobile responsive UI improvements

---

# Author

Miro Marinov  
Bachelor of Science – Computer Science (Software Development)  
Lewis University

---

# License

This project is intended for educational and portfolio purposes.
