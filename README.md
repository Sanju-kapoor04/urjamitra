# UrjaMitra – AI-Powered Utility Bill Intelligence & Anomaly Detection System

> **Official Product Name:** UrjaMitra  
> **Repository:** urjamitra  
> **Tagline:** Your Smart Utility Companion.  
> **AI Assistant:** UrjaMitra AI  

UrjaMitra is an AI-powered utility bill intelligence and anomaly detection platform designed specifically for the Indian market. It decodes complex Indian electricity, water, and broadband billing structures, identifies unexpected consumption anomalies using machine learning, breaks down telescopic tariff slabs, and generates legally compliant formal dispute notices.

---

## 🌟 Key Features

1. **AI Anomaly Detection Engine**:
   - Uses Scikit-learn **Isolation Forest** coupled with transparent Z-score rule-based verifiers.
   - Flags multidimensional shifts across consumption (kWh), fixed charge alterations, FPPCA fuel surcharges, and uncredited subsidies.
   - Classifies risk with levels: *Normal*, *Review Recommended*, *Unusual*, *High Priority*.

2. **Indian Tariff Slab Intelligence**:
   - Supports major Indian distribution companies: MPMKVVCL, MPPKVVCL, BSES Rajdhani, BSES Yamuna, Tata Power Delhi (TPDDL), MSEDCL, and BESCOM.
   - Telescopic slab calculation (e.g. 0-50, 51-150, 151-300, 301+ units) with State Electricity Duty (9%) and sanctioned load fixed charges.

3. **OCR & Document Extraction**:
   - Extract billing metrics from Indian utility PDFs and scanned receipts using PyMuPDF and regular expressions.
   - Automatically parses Consumer Number / CA Number, Meter Number, Billing Period, Energy Charges, and Net Payable Amount.

4. **UrjaMitra AI Chat Assistant**:
   - Bilingual conversational assistant supporting **English** and **Hindi**.
   - Answers questions regarding slab jumps, fixed demand charges, and energy conservation.

5. **Formal Consumer Dispute Notices**:
   - Auto-generates formal notices addressed to DISCOM Executive / Billing Engineers in both English and Hindi for meter accuracy audits and billing revisions.

6. **PM Surya Ghar Savings Calculator**:
   - Interactive slab-reduction simulator with rooftop solar savings guidance.

---

## 🏗️ Architecture & Tech Stack

| Tier | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts |
| **Backend** | Node.js, Express, TypeScript, Better-SQLite3 / MongoDB compatible, JWT, Multer |
| **AI / ML Service** | Python 3, FastAPI, Scikit-learn (Isolation Forest), Pandas, NumPy, PyMuPDF |
| **Deployment** | Docker, Docker Compose, Linux |

---

## 📁 Repository Structure

```
urjamitra/
├── ai-service/             # FastAPI AI/ML microservice
│   └── app/
│       └── main.py         # IsolationForest, extraction, and UrjaMitra AI chat
├── backend/                # Node.js/Express REST API
│   ├── src/
│   │   ├── database.ts     # SQLite schema, indexing & Indian DISCOM seed data
│   │   └── server.ts       # Authentication, OCR forwarder, comparison engine
│   └── tsconfig.json
├── frontend/               # Vite React SPA
│   ├── src/
│   │   ├── pages/          # Overview, Upload, Compare, AI Insights, Savings, Disputes
│   │   ├── components/     # UrjaMitra Dashboard navigation & layout
│   │   └── services/       # Axios API client
│   └── tailwind.config.js
├── tests/                  # Integration & unit test suites
├── docker-compose.yml      # Multi-container orchestration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- npm or pnpm

### 1. Start the AI/ML Intelligence Service
```bash
cd ai-service
pip install -r requirements.txt
python3 -m app.main
# Runs on http://localhost:8001
```

### 2. Start the Backend API
```bash
cd backend
npm install
npm run build
npm start
# Runs on http://localhost:5000
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

## 🛡️ License
MIT License. Built for Indian consumers and utility transparency.
