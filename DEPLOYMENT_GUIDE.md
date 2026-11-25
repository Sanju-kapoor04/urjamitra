# UrjaMitra – Production Deployment Guide

**Product Name:** UrjaMitra (`urjamitra`)  
**Tagline:** Your Smart Utility Companion.  
**Full Title:** UrjaMitra – AI-Powered Utility Bill Intelligence & Anomaly Detection System  
**Recommended Architecture:**
- **Frontend SPA:** Vercel (or Cloudflare Pages / Netlify)
- **Node.js Express Backend:** Render (Web Service)
- **FastAPI Python AI Service:** Render (Web Service)
- **Database:** MongoDB Atlas (Free M0 Cluster)

---

## 1. Hosting Architecture Overview

```
                                    ┌────────────────────────────────────┐
                                    │        Vercel (Frontend)           │
                                    │    https://urjamitra.vercel.app    │
                                    └─────────────────┬──────────────────┘
                                                      │ HTTPS REST calls
                                                      ▼
                                    ┌────────────────────────────────────┐
                                    │        Render (Node Backend)       │
                                    │ https://urjamitra-api.onrender.com │
                                    └─────────┬────────────────┬─────────┘
                                              │                │
                        Internal/HTTPS API    │                │ Mongoose Connection
                                              ▼                ▼
┌───────────────────────────────────────────────┐   ┌────────────────────────────────────────┐
│            Render (FastAPI AI)                │   │         MongoDB Atlas (Database)       │
│    https://urjamitra-ai.onrender.com          │   │  mongodb+srv://cluster0.mongodb.net    │
│  • PyMuPDF & Pattern Bill Extraction          │   │  • Persistent Bill & User Records      │
│  • Scikit-learn Isolation Forest ML Anomaly   │   │  • Multi-Tenant User Isolation         │
│  • Telescopic Slab Calculation                │   └────────────────────────────────────────┘
│  • Bilingual UrjaMitra AI Chat Engine         │
└───────────────────────────────────────────────┘
```

---

## 2. Prerequisites & Accounts to Create

Before deploying, ensure you have free accounts on:
1. **GitHub:** (To host the `urjamitra` repository)
2. **MongoDB Atlas:** (Free 512MB M0 Sandbox cluster)
3. **Render:** (Free tier for Node.js backend and Python FastAPI AI microservice)
4. **Vercel:** (Free Hobby tier for Vite React SPA)

---

## 3. Step-by-Step Deployment Procedure

### Step 1: Database Setup (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Click **Create Deployment** → Select **M0 (Free)** → Provider: **AWS** (Region: **Mumbai `ap-south-1`** recommended for lowest latency in India).
3. Under **Security Quickstart**:
   - Create a database user (e.g. `urjamitra_admin` with a strong password).
   - Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere) so Render web services can connect.
4. Click **Connect** → **Drivers (Node.js)** → Copy your connection string:
   ```text
   mongodb+srv://urjamitra_admin:<password>@cluster0.mongodb.net/urjamitra?retryWrites=true&w=majority
   ```

---

### Step 2: Deploy Python AI Service (Render)
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service** → Connect your GitHub repository (`urjamitra`).
3. Fill in the service parameters:
   - **Name:** `urjamitra-ai-service`
   - **Root Directory:** `ai-service`
   - **Environment:** `Python 3`
   - **Region:** `Singapore` (or closest to India)
   - **Branch:** `master` (or `main`)
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free`
4. **Environment Variables:**
   - `PYTHON_VERSION`: `3.10.12`
   - `GEMINI_API_KEY`: *(Optional: Leave empty for built-in rule-based bilingual advisor)*
5. Click **Create Web Service**.  
   *Note down the generated service URL (e.g., `https://urjamitra-ai-service.onrender.com`).*

---

### Step 3: Deploy Express Backend (Render)
1. On Render Dashboard, click **New +** → **Web Service** → Connect `urjamitra`.
2. Configure parameters:
   - **Name:** `urjamitra-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Region:** `Singapore`
   - **Branch:** `master` (or `main`)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/server.js`
   - **Instance Type:** `Free`
3. **Environment Variables:**
   | Key | Recommended Value / Source |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `JWT_SECRET` | *(Click "Generate" or use a 32+ character random string)* |
   | `AI_SERVICE_URL` | `https://urjamitra-ai-service.onrender.com` *(from Step 2)* |
   | `MONGODB_URI` | `mongodb+srv://urjamitra_admin:<password>@cluster0.mongodb.net/urjamitra?retryWrites=true&w=majority` |
   | `ALLOWED_ORIGINS` | `*` *(or your Vercel domain once generated)* |
4. Click **Create Web Service**.  
   *Note down the backend URL (e.g., `https://urjamitra-backend.onrender.com`).*
5. Test the health endpoint: `https://urjamitra-backend.onrender.com/api/health`.

---

### Step 4: Deploy Frontend SPA (Vercel)
1. Log in to [Vercel](https://vercel.com/) and click **Add New...** → **Project**.
2. Import the `urjamitra` repository from GitHub.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click edit and select `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**
   - `VITE_API_BASE_URL`: `https://urjamitra-backend.onrender.com` *(Backend URL from Step 3)*
5. Click **Deploy**.  
   *Vercel will output your live URL (e.g., `https://urjamitra.vercel.app`).*

---

## 4. Alternative Single-Click Deployment via `render.yaml`

If deploying both backend services together on Render:
1. Connect the `urjamitra` repository to Render as a **Blueprint**.
2. Render will automatically parse the committed `render.yaml` and provision:
   - `urjamitra-ai-service`
   - `urjamitra-backend`
3. Supply `MONGODB_URI` when prompted in the Render Blueprint setup wizard.

---

## 5. Production Health Check & Verification Checklist

Once deployed, verify the system through the live domain:
- [ ] Visit `https://your-frontend.vercel.app/` – Public landing page loads without errors.
- [ ] Sign in with demo credentials or register a new user with +91 mobile and 6-digit PIN.
- [ ] Upload `sample_mp_electricity_bill.pdf` from `/sample_data/`.
- [ ] Verify extracted units (330 kWh) and amount (₹2267.65) on the verification card.
- [ ] View the **Bill Comparison** tab – verify the Isolation Forest anomaly badge.
- [ ] Open **Savings Calculator** – adjust consumption slider to verify slab math.
- [ ] Test **UrjaMitra AI** chat in both English and Hindi.
- [ ] Generate a formal dispute notice and verify copy-to-clipboard.

---

## 6. Troubleshooting Common Deployment Issues

| Symptom | Cause | Solution |
|---|---|---|
| **Render Web Service Spindown (50-second initial load)** | Free instances sleep after 15 minutes of inactivity. | Normal for free tier; wait 45-60 seconds for the container to wake, or configure a free cron pinger via UptimeRobot. |
| **CORS error in browser console** | `ALLOWED_ORIGINS` on backend does not match frontend origin. | Set `ALLOWED_ORIGINS=*` in Render backend environment variables. |
| **`MongooseServerSelectionError`** | MongoDB Atlas IP access list blocked Render's IP. | Go to MongoDB Atlas → Network Access → Ensure `0.0.0.0/0` is active. |
| **Vite 404 on page refresh** | SPA router needs fallback to `index.html`. | Verified: `frontend/vercel.json` already contains rewrites rule routing `/(.*)` to `/index.html`. |
