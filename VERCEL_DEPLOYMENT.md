# Vercel Deployment Guide

## Overview

This full-stack application is configured for deployment on Vercel with HTTPS support.

**Frontend:** React + Vite on Vercel  
**Backend:** Express API serverless functions on Vercel  
**HTTPS:** Automatic (built-in with Vercel)  
**Domain:** `https://exp-8-fullstack.vercel.app` (or your custom domain)

---

## Prerequisites

1. **Vercel Account:** Create one at https://vercel.com
2. **GitHub Repository:** Already set up at https://github.com/Akshra-06/exp-8-fullstack.git
3. **Node.js:** v16+ installed locally

---

## Deployment Steps

### Step 1: Push Latest Changes to GitHub

```bash
git add .
git commit -m "Setup Vercel deployment with HTTPS"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your GitHub URL: `https://github.com/Akshra-06/exp-8-fullstack.git`
4. Click "Import"

### Step 3: Configure Project Settings

On the "Configure Project" page:

1. **Framework:** Select "Other"
2. **Root Directory:** Leave empty (mono-repo detected automatically)
3. **Build Command:**
   ```
   npm run build
   ```
4. **Output Directory:** `client/dist`

### Step 4: Set Environment Variables

In "Environment Variables" section, add:

| Key              | Value                                                              |
| ---------------- | ------------------------------------------------------------------ |
| `PORT`           | `3000`                                                             |
| `NODE_ENV`       | `production`                                                       |
| `CLIENT_ORIGIN`  | `https://exp-8-fullstack.vercel.app`                               |
| `JWT_SECRET`     | `8f2e9a7c3b1d5e8f4a2c0b6d9e1f3a7c5b8d2e0f1a4c6b9d3e7f0a2c5b8d1e4f` |
| `JWT_EXPIRES_IN` | `1h`                                                               |

⚠️ **Important:** Change `JWT_SECRET` to a secure random value before production!

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. You'll receive a unique Vercel URL like: `https://exp-8-fullstack.vercel.app`

---

## After Deployment

### Update API Endpoint (if needed)

Your frontend will automatically use the deployed backend since the API requests are relative paths. However, if you customize the API endpoint:

**File:** `client/src/lib/api.js`

```javascript
// For production, use relative paths (they'll use the same domain)
const baseURL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5001/api";
```

### Test Your Deployment

```bash
# Visit in browser
https://exp-8-fullstack.vercel.app

# Test login with demo accounts:
# Admin: admin@example.com / admin123
# User: user@example.com / password123
```

### View Logs

```bash
# In Vercel dashboard, go to:
# Settings > Functions > Logs
```

---

## Key Files for Vercel

- **`vercel.json`** - Deployment configuration
- **`api/index.js`** - Serverless API handler
- **`.env.production`** - Production environment variables
- **`client/vite.config.js`** - Frontend build config
- **`server/src/app.js`** - Express app exported for Vercel

---

## HTTPS Enabled by Default

Vercel automatically provides HTTPS with free SSL certificates. Your app is secure at:

- 🔒 `https://exp-8-fullstack.vercel.app`

---

## Troubleshooting

### Build Fails

Check build logs in Vercel dashboard: Settings > Build & Development Settings

### API not responding

Verify environment variables are set correctly in Vercel Settings > Environment Variables

### CORS errors

The `CLIENT_ORIGIN` must exactly match your Vercel domain (with `https://`)

### Custom Domain

To add a custom domain:

1. Go to Vercel Settings > Domains
2. Add your domain
3. Update DNS records (instructions provided by Vercel)
4. Update `CLIENT_ORIGIN` environment variable

---

## Demo Accounts

| Role  | Email             | Password    |
| ----- | ----------------- | ----------- |
| Admin | admin@example.com | admin123    |
| User  | user@example.com  | password123 |

---

## Next Steps

1. Deploy to Vercel using steps above
2. Test the live application
3. Update custom environment variables as needed
4. Share your live URL with others

For more help, visit: https://vercel.com/docs
