# UrjaMitra – Pre-Deployment Checklist

**Repository:** `urjamitra`  
**Official Name:** UrjaMitra – AI-Powered Utility Bill Intelligence & Anomaly Detection System  
**Audit Status:** Deployment Ready  

---

## 1. Component Readiness Status

- [x] **Frontend SPA (React 18 + TypeScript + Vite + Tailwind CSS)**: Build verified with 0 errors. Configurable `VITE_API_BASE_URL`. `vercel.json` includes SPA rewrites and security headers.
- [x] **Node.js Express Backend**: Fully compiled TypeScript (`dist/server.js`). Dynamic CORS origin validation. Dual-storage resilience (MongoDB Atlas + persistent SQLite fallback).
- [x] **Python FastAPI AI Microservice**: Scikit-learn `IsolationForest`, PyMuPDF OCR extractor, deterministic slab savings, and bilingual UrjaMitra AI assistant.
- [x] **Database & Models**: Mongoose schemas defined and tested.
- [x] **Security**: No hardcoded secrets. Root `.gitignore` excludes all `.env` files, node_modules, and cache.
- [x] **Automated Test Suite**: Passed all unit, isolation, and end-to-end master workflow tests.

---

## 2. Environment Variables to Configure on Hosting Platforms

### A. Python AI Microservice (Render)
- `PYTHON_VERSION`: `3.10.12`
- `GEMINI_API_KEY`: *(Optional: Operates deterministic bilingual rule engine if blank)*

### B. Node.js Express Backend (Render)
- `NODE_ENV`: `production`
- `PORT`: `5000`
- `JWT_SECRET`: *(32+ character random string)*
- `AI_SERVICE_URL`: `https://<your-ai-service-name>.onrender.com`
- `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/urjamitra?retryWrites=true&w=majority`
- `ALLOWED_ORIGINS`: `*`

### C. React Frontend (Vercel)
- `VITE_API_BASE_URL`: `https://<your-backend-name>.onrender.com`

---

## 3. External Accounts Required
1. **GitHub** (Repo hosting)
2. **MongoDB Atlas** (Free M0 database cluster)
3. **Render** (Free hosting for Node & Python backend services)
4. **Vercel** (Free hosting for Vite React frontend)

---

## 4. Recommended Deployment Sequence
1. **Push Clean Git Repository to GitHub:**
   ```bash
   git remote add origin https://github.com/<your-username>/urjamitra.git
   git branch -M main
   git push -u origin main
   ```
2. **Deploy MongoDB Atlas M0 Cluster** in Mumbai (`ap-south-1`) & whitelist `0.0.0.0/0`.
3. **Deploy Python AI Service on Render** (Root directory: `ai-service`).
4. **Deploy Node.js Backend on Render** (Root directory: `backend`), linking `AI_SERVICE_URL` and `MONGODB_URI`.
5. **Deploy Frontend on Vercel** (Root directory: `frontend`), pointing `VITE_API_BASE_URL` to Render backend.
6. **Live End-to-End Validation:** Run through user registration, sample bill upload, comparison, and dispute letter export on the production domain.
