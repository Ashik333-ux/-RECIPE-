# The Recipe Book — Full-Stack MERN Application

A refined, responsive, full-stack recipe management application built with the **MERN** stack (MongoDB Atlas, Express.js, React, Node.js) and Vite. Designed with an editorial cookbook aesthetic, full CRUD persistence, real-time filtering and search, client and server validation, and interactive feedback.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [Database Seeding](#database-seeding)
- [Automated Testing & Verification](#automated-testing--verification)
- [REST API Documentation](#rest-api-documentation)
- [Troubleshooting](#troubleshooting)

---

## Overview

**The Recipe Book** allows culinary enthusiasts to curate, organize, and cherish their recipes in one digital journal. All data persists directly to a live **MongoDB Atlas** database through an Express REST API with Mongoose schema validation.

The user interface follows a warm editorial cookbook aesthetic inspired by culinary journals, featuring warm cream backgrounds (`#FAF7F0`), deep forest green accents (`#244B3C`), muted sage elements (`#E5EDE4`), and terracotta highlights (`#C96D4A`).

---

## Key Features

- **Full CRUD Persistence**: Create, View, Edit, and Delete recipes directly backed by MongoDB Atlas.
- **Editorial Cookbook Aesthetic**: Custom palette, balanced typography, card elevation, and responsive layouts across desktop, tablet, and mobile.
- **Dynamic Search & Filtering**:
  - Live case-insensitive search by recipe title.
  - Multi-category filtering: `Breakfast`, `Lunch`, `Dinner`, `Snack`, `Dessert`, and `Other`.
  - Active filter tracking with one-click clear button and empty search states.
- **Image Fallback System**: Displays loaded recipe photography or gracefully switches to category-themed culinary illustrations if an image fails or is omitted.
- **Live Form Validation**:
  - Text fields validated for non-empty and non-whitespace values.
  - Cooking time strictly validated for positive integers (>= 1).
  - Optional image URLs validated for `http://` or `https://` protocol with live image preview.
  - Double validation on both React frontend and Express/Mongoose backend.
- **Interactive Modals & Toasts**:
  - Keyboard-accessible confirmation dialog before deleting recipes.
  - Auto-dismissing success and error toasts for all mutations.
- **Resilient Error Handling**: Graceful loading skeletons, empty state prompts, and retryable error cards.

---

## Technology Stack

### Frontend
- **React 18** — Component-based user interface
- **Vite 5** — Rapid frontend tooling and build pipeline
- **React Router DOM 7** — Client-side declarative routing
- **Axios** — Centralized HTTP client with timeout and base URL configuration
- **Lucide React** — Minimal, accessible icon system
- **Vanilla CSS3** — CSS custom properties, flexbox, CSS grid, and media queries

### Backend
- **Node.js** (ES Modules) — Server runtime
- **Express 5** — REST API routing and middleware
- **Mongoose 9** — MongoDB object modeling and schema validation
- **MongoDB Atlas** — Cloud-hosted NoSQL document database
- **CORS** — Cross-Origin Resource Sharing middleware
- **dotenv** — Environment configuration

---

## Project Architecture

```
-RECIPE-/
├── .gitignore
├── README.md
├── backend/
│   ├── models/
│   │   └── Recipe.js          # Mongoose schema with custom validators
│   ├── routes/
│   │   └── recipeRoutes.js    # REST API endpoints (GET, POST, PUT, DELETE)
│   ├── server.js              # Express app entry & Atlas connection
│   ├── seed.js                # Database seeder script
│   ├── test.js                # Automated backend verification test suite
│   ├── .env                   # Local credentials (git-ignored)
│   ├── .env.example           # Safe placeholder environment template
│   ├── .gitignore
│   └── package.json
└── frontend/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── components/
    │   │   ├── CategoryFilter.jsx   # Category filter pills
    │   │   ├── ConfirmDialog.jsx    # Accessible delete confirmation modal
    │   │   ├── EmptyState.jsx       # Editorial empty states with actions
    │   │   ├── LoadingState.jsx     # Loading spinner & status
    │   │   ├── Navbar.jsx           # Top branding and navigation
    │   │   ├── RecipeCard.jsx       # Card with image, metadata, and actions
    │   │   └── SearchBar.jsx        # Search input with clear button
    │   ├── context/
    │   │   └── ToastContext.jsx     # Toast notification system
    │   ├── pages/
    │   │   ├── HomePage.jsx         # Hero, search/filter, and recipe grid
    │   │   ├── NotFoundPage.jsx     # 404 handler
    │   │   ├── RecipeDetailsPage.jsx# Full ingredients, steps, and actions
    │   │   └── RecipeFormPage.jsx   # Unified Add / Edit recipe form
    │   ├── services/
    │   │   └── api.js               # Centralized Axios service instance
    │   ├── App.jsx                  # Route definitions
    │   ├── index.css                # Editorial cookbook styling
    │   └── main.jsx                 # React root mount
    ├── .env                         # Local frontend environment variables
    ├── .env.example                 # Frontend environment template
    ├── .gitignore
    ├── eslint.config.js             # ESLint configuration
    ├── index.html                   # HTML entry point with fonts & metadata
    ├── package.json
    └── vite.config.js
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB Atlas**: A live Atlas cluster and connection string

---

## Environment Configuration

### Backend (`backend/.env`)
Create `backend/.env` (or copy from `backend/.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/recipe_book?retryWrites=true&w=majority
```

> **Security Note**: Never commit `.env` containing live database credentials to version control. Ensure `backend/.env` is listed in `backend/.gitignore`.

### Frontend (`frontend/.env`)
Create `frontend/.env` (or copy from `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation and Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## Running the Application

### Start Backend API Server
From the `backend/` directory:
```bash
cd backend
npm start
# Or for auto-reloading during development:
npm run dev
```
The API server will listen on `http://localhost:5000`.

### Start Frontend Application
In a separate terminal, from the `frontend/` directory:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your web browser to interact with the application.

---

## Database Seeding

To quickly populate MongoDB Atlas with 5 sample gourmet recipes:
```bash
cd backend
npm run seed
```

---

## Automated Testing & Verification

### Backend Verification
Run the automated test suite to verify MongoDB Atlas connectivity, model constraints, and CRUD lifecycle:
```bash
cd backend
npm test
```

### Syntax Validation
Ensure all backend files pass strict syntax inspection:
```bash
cd backend
node --check server.js
node --check models/Recipe.js
node --check routes/recipeRoutes.js
```

### Frontend Linting & Production Build
Ensure code adheres to standards and compiles cleanly:
```bash
cd frontend
npm run lint
npm run build
```

---

## REST API Documentation

Base URL: `http://localhost:5000/api`

### 1. Health Check
- **Endpoint**: `GET /health`
- **Response**: `200 OK`
```json
{
  "status": "ok",
  "message": "Server is healthy"
}
```

### 2. List All Recipes
- **Endpoint**: `GET /recipes`
- **Response**: `200 OK`
- Returns an array of recipes sorted by creation date descending.

### 3. Retrieve Single Recipe
- **Endpoint**: `GET /recipes/:id`
- **Response Codes**:
  - `200 OK`: Returns the recipe object.
  - `400 Bad Request`: If `:id` is not a valid MongoDB ObjectId.
  - `404 Not Found`: If no recipe exists with that ID.

### 4. Create Recipe
- **Endpoint**: `POST /recipes`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Rustic Shakshuka",
  "category": "Breakfast",
  "cookingTime": 25,
  "imageUrl": "https://example.com/shakshuka.jpg",
  "ingredients": "4 eggs\n1 can crushed tomatoes\n1 onion\nSpices",
  "steps": "1. Sauté onions.\n2. Add tomatoes and simmer.\n3. Crack eggs and cover."
}
```
- **Response Codes**:
  - `201 Created`: Returns newly created recipe document with `_id` and timestamps.
  - `400 Bad Request`: Validation failure (empty name, non-positive integer time, bad URL, invalid category).

### 5. Update Recipe
- **Endpoint**: `PUT /recipes/:id`
- **Headers**: `Content-Type: application/json`
- **Response Codes**:
  - `200 OK`: Returns updated recipe.
  - `400 Bad Request`: Validation failure or invalid ObjectId.
  - `404 Not Found`: Recipe not found.

### 6. Delete Recipe
- **Endpoint**: `DELETE /recipes/:id`
- **Response Codes**:
  - `200 OK`: `{ "message": "Recipe deleted successfully", "id": "..." }`
  - `400 Bad Request`: Invalid ObjectId.
  - `404 Not Found`: Recipe not found.

---

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| `Failed to connect to MongoDB` | Invalid `MONGO_URI` or Atlas IP whitelist restriction | Check your `backend/.env` file. Ensure `0.0.0.0/0` is whitelisted in MongoDB Atlas Network Access. |
| `Network Error` in frontend | Backend is not running or port conflict | Verify that the backend is running on `http://localhost:5000` and `VITE_API_URL` is set to `http://localhost:5000/api`. |
| Broken recipe image | Expired or non-CORS image URL | The application automatically falls back to an aesthetic category icon card when an image URL fails to load. |
