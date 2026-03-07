![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

# Job Stats

Job Stats is a full-stack web application for tracking job applications, interview stages, and job search statistics.
It allows users to store applications, monitor their progress, and analyze their job search over time.

This project is built with a modern full-stack architecture using React, Node.js, Express, PostgreSQL, and Docker.

---

## Tech Stack

Frontend

* React
* Tailwind CSS
* Chart.js

Backend

* Node.js
* Express

Database

* PostgreSQL

DevOps / Infrastructure

* Docker
* Docker Compose

---

## Architecture

Browser
↓
React Frontend
↓
Node.js Express API
↓
PostgreSQL Database (Docker)

---

## Features

* Create job applications
* View all saved applications
* Track application status
* Store notes about each application
* REST API backend
* Dockerized PostgreSQL database
* Modular backend architecture (routes / controllers / models)

---

## Project Structure

```
job-stats
│
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
├── database
│   └── init.sql
│
├── frontend
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## API Endpoints

### Get all applications

GET `/applications`

Returns all job applications.

---

### Create application

POST `/applications`

Example request body:

```json
{
  "company": "Epic Systems",
  "position": "Software Developer",
  "location": "Madison, WI",
  "salary": 85000,
  "status": "Applied",
  "dateApplied": "2026-03-07",
  "notes": "Applied through careers page",
  "userId": 1
}
```

---

## Running the Project Locally

### 1. Clone the repository

```
git clone https://github.com/YOUR_USERNAME/job-stats.git
cd job-stats
```

---

### 2. Start the PostgreSQL database

```
docker compose up
```

This starts the PostgreSQL container.

---

### 3. Start the backend server

```
cd backend
npm install
npm run dev
```

The API will run at:

```
http://localhost:5000
```

---

## Future Improvements

* React frontend dashboard
* Authentication with JWT
* Job application statistics
* Data visualization
* Deployment

---

## Author

Miro Marinov
Bachelor's in Computer Science – Software Development
