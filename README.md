# Jambo Admin

This repository contains the admin dashboard for Jambo, a credit management system. It includes a backend service and a frontend application. This project is an adaptation of the customer facing side of the application, modified for administrative purposes.

## Project Structure

*   `/backend`: A Node.js backend built with Fastify and Drizzle ORM.
*   `/frontend`: A React-based frontend application.

## Prerequisites

*   [Bun](https://bun.sh/)
*   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### 1. Backend Setup

The backend service uses a PostgreSQL database, which is managed with Docker Compose.

**Start the database:**

```bash
docker-compose up -d
```

**Install backend dependencies:**

```bash
cd backend
bun install
```

**Run database migrations:**

```bash
bun run drizzle-kit:migrate (avoid migrating while client is also done migrating)
```

**Run the backend server:**

```bash
bun run dev
```

The backend will be running at `http://localhost:4000`.

### 2. Frontend Setup

**Install frontend dependencies:**

```bash
cd frontend
bun install
```

**Run the frontend application:**

```bash
bun run dev
```

The frontend will be running at `http://localhost:3001`.

## Available Scripts

### Backend (`/backend`)

*   `bun install`: Install dependencies.
*   `bun run dev`: Start the development server.
*   `bun run drizzle-kit:generate`: Generate new database migrations.
*   `bun run drizzle-kit:migrate`: Apply database migrations.

### Frontend (`/frontend`)

*   `bun install`: Install dependencies.
*   `bun run dev`: Start the development server.
*   `bun run build`: Build the application.
*   `bun run check-types`: Run TypeScript type checking.

## NOTICE
in docker compose the backend is exposed to the host network for easy testing.
