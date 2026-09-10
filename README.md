# Artisan Platform 🛠️

A simple web app that connects clients with local artisans (plumbing, electricity, locksmith, etc.).

## Stack
- **Backend**: Node.js + Express + Socket.io + JWT (in-memory store, no DB needed)
- **Frontend**: React + Vite + Tailwind CSS + React Router v6

## Quick Start

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start backend (port 5000)
cd backend && npm start

# Start frontend (port 3000)
cd frontend && npm run dev
```

## Demo Accounts
- **Client**: `client@demo.fr` / `password123`
- **Artisan**: `plombier@demo.fr` / `password123`

## Features
- Client & Artisan registration / login (JWT)
- Search artisans by specialty and city
- Send job requests (demandes)
- Artisan dashboard: accept / refuse / complete requests
- Client dashboard: track request statuses
- Real-time chat (Socket.io)
