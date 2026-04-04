# Finance Data Processing and Access Control Backend

## Overview

This project is a backend system for managing financial records with role-based access control. It supports secure authentication, data processing, and dashboard analytics.

---

## Tech Stack

* Node.js + Express.js
* MongoDB + Mongoose
* JWT Authentication
* express-validator
* Swagger (API Docs)

---

## Architecture

The backend follows a layered architecture:

Route -> Middleware -> Controller -> Model

This ensures separation of concerns and maintainability.

---

## Authentication & Authorization

* JWT-based authentication
* Role-Based Access Control (RBAC)

### Roles:

* Viewer → View dashboard only
* Analyst → View records + analytics
* Admin → Full access (users + records)

---

## User Management

* Create users (register)
* Update user roles (ADMIN)
* Activate / deactivate users (ADMIN)
* Role-based restrictions enforced via middleware

---

## Financial Records

Supports:

* Create, update, delete (soft delete)
* View records with filtering:

  * type
  * category
  * date range
  * search (category/notes)
* Pagination support

---

## Dashboard APIs

Provides aggregated insights:

* Total income
* Total expenses
* Net balance
* Category-wise breakdown
* Monthly trends (using MongoDB aggregation)

---

## Features Implemented

* JWT Authentication
* Role-Based Access Control
* Filtering & Pagination
* Soft Delete
* Aggregation APIs
* Input Validation
* Global Error Handling
* Rate Limiting
* Swagger API Documentation

---

## API Endpoints

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Users (ADMIN)

* GET /api/users
* PATCH /api/users/:id/role
* PATCH /api/users/:id/status

### Records

* POST /api/records (ADMIN)
* GET /api/records (ANALYST, ADMIN)
* GET /api/records/:id (ANALYST, ADMIN)
* PATCH /api/records/:id (ADMIN)
* DELETE /api/records/:id (ADMIN)

### Dashboard

* GET /api/dashboard/summary
* GET /api/dashboard/categories
* GET /api/dashboard/trends
* GET /api/dashboard/recent (ANALYST, ADMIN)

---

## Setup Instructions

```bash
git clone <your-repo>
cd finance-backend
npm install
npm run dev
```

Create `.env` file (see `.env.example`):

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

---

## Seed Script

To quickly populate the database with sample users and financial records:

```bash
npm run seed
```

This will create:
- Admin user
- Analyst user
- Viewer user
- Sample financial records for testing

Default credentials:

admin@test.com / 123456
analyst@test.com / 123456
viewer@test.com / 123456

## API Documentation

Visit:
http://localhost:5000/api-docs

---

## Run With Docker

```bash
docker compose up --build
```

API: http://localhost:5000

---

## Response Format

Success:

```json
{ "success": true, "data": {}, "meta": {} }
```

Error:

```json
{ "success": false, "error": { "message": "...", "code": "...", "details": {} }, "requestId": "..." }
```

---

## Logging

Structured logs via pino, with `X-Request-Id` attached to every response.

---

## Design Decisions

* MongoDB chosen for flexible schema and aggregation support
* JWT used for stateless authentication
* Aggregation pipelines used for efficient analytics

---

## Assumptions

* Only ADMIN can manage users and records
* Analysts can view but not modify data
* Viewers have restricted access

---

## Postman Collection

A Postman collection is included for easy API testing.

Steps:

1. Import `Finance Backend API.postman_collection.json` into Postman
2. Set the base URL and token
3. Test all endpoints


<<<<<<< HEAD
## Author
=======
##  Author
>>>>>>> b0b16821be779c5b320d4e6756ce1144d225683e

C Bhuvaneshvar Reddy
