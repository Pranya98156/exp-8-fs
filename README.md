# JWT Protected Routes (React + Express)

Industry-standard full-stack structure with:
- Express API with JWT authentication and protected endpoints
- React Router protected pages on the client
- Clean folder separation by concern (config, middleware, controllers, routes)

## Project Structure

```text
exp-3.1.2/
  client/
  server/
```

## Quick Start

1. Setup backend env:

```bash
cd server
cp .env.example .env
```

2. Install dependencies from the repo root:

```bash
cd ..
npm install
```

3. Run both backend and frontend together from the repo root:

```bash
npm run dev
```

If you prefer separate terminals:

```bash
npm --prefix server run dev
npm --prefix client run dev
```

Frontend runs at `http://localhost:5173` and backend at `http://localhost:5001` by default.

## Deploy to Vercel

This repo is configured for Vercel full-stack deployment with the frontend served from `client/dist` and the backend available under `/api`.

1. Install the Vercel CLI if needed:

```bash
npm install -g vercel
```

2. From the repo root, deploy the project:

```bash
vercel
```

3. When prompted, select the current project folder and confirm the root.

4. Optional: set environment variables in Vercel for production security:

- `JWT_SECRET`
- `CLIENT_ORIGIN=https://<your-vercel-domain>`

If you want to deploy through GitHub integration, connect this repo in the Vercel dashboard and Vercel will build automatically on pushes to `main`.
