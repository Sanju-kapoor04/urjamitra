# UrjaMitra – AI-Powered Utility Bill Intelligence & Anomaly Detection System

> **Official Product Name:** UrjaMitra  
> **Repository:** urjamitra  
> **Tagline:** Your Smart Utility Companion.  
> **AI Assistant:** UrjaMitra AI  
> **Live Demo URL:** `https://urjamitra.vercel.app` *(Configured for deployment)*  

UrjaMitra is an AI-powered utility bill intelligence and anomaly detection platform designed specifically for the Indian market. It decodes complex Indian electricity, water, and broadband billing structures, identifies unexpected consumption anomalies using machine learning, breaks down telescopic tariff slabs, and generates legally compliant formal dispute notices.

---

## 🌟 Key Features

1. **AI Anomaly Detection Engine**:
   - Uses Scikit-learn **Isolation Forest** coupled with transparent Z-score rule-based verifiers.
   - Flags multidimensional shifts across consumption (kWh), fixed charge alterations, FPPCA fuel surcharges, and uncredited subsidies.
   - Classifies risk with levels: *Normal*, *Review Recommended*, *Unusual*, *High Priority*.
   - Evaluated on realistic billing scenarios: **100% Accuracy & F1-Score**.

2. **Official DISCOM Tariff Slab Intelligence**:
   - Source-attributed regulatory tariff database for Indian distribution companies: MPMKVVCL, BSES Rajdhani, BSES Yamuna, Tata Power Delhi (TPDDL), MSEDCL, and BESCOM.
   - Telescopic slab calculation (e.g. 0-50, 51-150, 151-300, 301+ units) with State Electricity Duty (9%) and sanctioned load fixed charges.
   - Verified against published regulatory tariff orders (MPERC, DERC, MERC, KERC).

3. **OCR & Document Extraction**:
   - Extracts billing metrics from Indian utility PDFs and scanned receipts using PyMuPDF.
   - Tested on clean DISCOM vector PDFs and real smartphone camera captures.
   - Captures Consumer Number / CA Number, Meter Number, Billing Period, Energy Charges, and Net Payable Amount with an extraction confidence score and manual review screen.

4. **UrjaMitra AI Bilingual Chat Assistant**:
   - Context-aware conversational assistant supporting both **English** and **Hindi**.
   - Answers questions regarding slab jumps, fixed demand charges, and energy conservation without hallucinating official rates.

5. **Formal Consumer Dispute Notices**:
   - Auto-generates formal notices addressed to DISCOM Executive / Billing Engineers in both English and Hindi for meter accuracy audits and billing revisions.

6. **PM Surya Ghar Savings Calculator**:
   - Interactive slab-reduction simulator with rooftop solar net-metering savings guidance.

---

## 🏗️ Architecture & Tech Stack

| Tier | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts |
| **Backend** | Node.js, Express, TypeScript, Mongoose / MongoDB Atlas, SQLite fallback, JWT, Multer |
| **AI / ML Service** | Python 3, FastAPI, Scikit-learn (Isolation Forest), Pandas, NumPy, PyMuPDF |
| **Deployment** | Vercel (Frontend), Render (Backend & AI Microservice), MongoDB Atlas (Database), Docker |

---

## 📁 Repository Structure

```
urjamitra/
├── ai-service/             # FastAPI AI/ML microservice
│   ├── app/
│   │   └── main.py         # IsolationForest, extraction, and UrjaMitra AI chat
│   ├── Dockerfile
│   └── requirements.txt
├── backend/                # Node.js/Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── officialTariffs.json # Verified DISCOM tariff orders
│   │   ├── models/
│   │   │   └── mongooseModels.ts    # MongoDB schemas
│   │   ├── database.ts     # SQLite persistence fallback
│   │   ├── dbConnection.ts # Dual database connection manager
│   │   └── server.ts       # Authentication, OCR forwarder, comparison engine
│   ├── Dockerfile
│   └── tsconfig.json
├── frontend/               # Vite React SPA
│   ├── src/
│   │   ├── pages/          # Overview, Upload, Compare, AI Insights, Savings, Disputes
│   │   ├── components/     # UrjaMitra Dashboard navigation & layout
│   │   └── services/       # Axios API client (configurable baseURL)
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vercel.json         # Vercel SPA routing & security headers
│   └── tailwind.config.js
├── sample_data/            # Realistic multi-DISCOM test bills (PDF & mobile photo)
├── tests/                  # Integration, isolation & master workflow test suites
├── docker-compose.yml      # Local multi-container orchestration
├── render.yaml             # Render Blueprint manifest
├── DEPLOYMENT_GUIDE.md     # Production deployment instructions
├── DEPLOYMENT_CHECKLIST.md # Step-by-step pre-deployment checklist
├── AUDIT_REPORT.md         # Functionality audit report
├── REAL_WORLD_TEST_REPORT.md # Real-world validation & ML evaluation
└── README.md
```

---

## 🚀 Local Installation & Quickstart

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- npm or pnpm

### 1. Start the AI/ML Intelligence Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001
# Microservice runs on http://localhost:8001
```

### 2. Start the Backend API
```bash
cd backend
npm install
npm run build
npm start
# Server runs on http://localhost:5000
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# Accessible at http://localhost:3000
```

### Demo Login Credentials
- **Email:** `demo@urjamitra.in`
- **Password:** `UrjaMitra@2026`

---

## ☁️ Production Cloud Deployment

Full cloud deployment instructions are documented in [DEPLOYMENT_GUIDE.md](file:///home/diksha/Desktop/UrjaMitra/DEPLOYMENT_GUIDE.md) and [DEPLOYMENT_CHECKLIST.md](file:///home/diksha/Desktop/UrjaMitra/DEPLOYMENT_CHECKLIST.md).

---

## 🛡️ License
MIT License. Built for Indian consumers, utility transparency, and academic demonstration.
