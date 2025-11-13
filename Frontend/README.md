PolyLab Frontend
=================

## Prerequisites

- Node.js 18+ (LTS recommended)
- Auth API running locally (see `services/auth_api/README.md`)

## Setup

1. Install dependencies  
   ```bash
   cd Frontend
   npm install
   ```
2. Configure environment variables  
   Create `Frontend/.env` (or `.env.local`) with at least:
   ```
   VITE_API_BASE_URL_AUTH=http://localhost:8000
   ```
   Change the URL if your backend runs elsewhere.
3. Start the dev server  
   ```bash
   npm run dev
   ```
   Vite serves the app on http://localhost:5173 and forwards API calls to the Auth service.

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS
- framer-motion, lucide-react

## Path aliases

- `@` → `src`
