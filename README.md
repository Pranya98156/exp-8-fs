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
