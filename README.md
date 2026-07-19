# CMCP — AI and Machine Learning-Based Chennai Metro Crowd Prediction System

**For Passenger Forecasting and Smart Operations**
MCA Final Year Project

A full-stack AI/ML system that forecasts station-level crowd density across the Chennai
Metro network (Blue Line + Green Line), with a live dashboard, interactive map, smart
route planner, and analytics.

---

## Project Structure

```
metro-crowd-prediction/
├── frontend/       React 19 + TypeScript + Tailwind + Framer Motion
├── backend/        Node.js + Express + Prisma + Socket.IO
├── ml-service/     Python + Flask + XGBoost + SHAP
└── docs/           Report, presentation, screenshots
```

## Important note on data (read this before your viva)

Chennai Metro Rail Limited (CMRL) does not publish a public real-time or historical
ridership API. This project uses a **synthetic ridership dataset**, generated using
realistic assumptions: known station tiers/importance, peak commute hours (8-10 AM,
5-8 PM), weekday vs weekend patterns, IT-corridor stations (Guindy, Alandur, Vadapalani
etc.), interchange stations, weather effects, and festival-day spikes. This is disclosed
here and should be stated clearly in your report's methodology section — don't be caught
off guard if an evaluator asks about the data source.

The "live" feed on the dashboard is a **simulated** live feed (a cron job that
re-runs predictions every 15 seconds using the current real-world time), since there's no
live CMRL data source to plug into. Also disclosed for the same reason.

---

## Quick Start

### 1. ML Service (do this first — backend depends on it)

```bash
cd ml-service
pip install -r requirements.txt --break-system-packages   # or use a venv
python data/generate_synthetic_data.py                     # generates raw/synthetic_ridership.csv
python src/train.py                                        # trains model, ~88.7% accuracy
python app.py                                               # runs on http://localhost:5001
```

The model is already trained and included in `models/` — you only need to re-run
`generate_synthetic_data.py` + `train.py` if you want to regenerate it from scratch.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env          # then edit DATABASE_URL to point at your PostgreSQL instance
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed           # seeds all 31 stations with real coordinates
npm run dev                   # runs on http://localhost:4000
```

You need a running PostgreSQL database. If you don't want to set one up locally, the
easiest options are a free instance on [Neon](https://neon.tech) or [Supabase](https://supabase.com)
— just paste the connection string into `DATABASE_URL`.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env           # defaults already point to localhost:4000, fine for local dev
npm run dev                    # runs on http://localhost:5173
```

**The frontend works even without the backend/ML service running** — every API call has
a local mock-data fallback, so you can develop and demo the UI standalone. Once you wire
up the real backend, it automatically switches to live data (look for the "Live feed" /
"Simulated" indicator in the navbar).

---

## What's already done for you

- ✅ Synthetic data generator (69,120 rows across 31 stations × 120 days)
- ✅ Trained XGBoost model — **88.7% accuracy**, saved in `ml-service/models/`
- ✅ SHAP explainability wired into the `/predict` endpoint
- ✅ Flask API fully functional (`/predict`, `/predict/batch`, `/metadata`, `/health`)
- ✅ Express backend with Prisma schema, JWT admin auth, Socket.IO live updates
- ✅ Full React frontend: Home, Dashboard, Live Map (Leaflet), Route Planner, Analytics, Admin
- ✅ Real Chennai Metro station names + coordinates (Blue + Green line, 31 stations)
- ✅ Verified: `tsc --noEmit` passes clean, `npm run build` succeeds

## What you still need to do

- [ ] Set up a real PostgreSQL database (Neon/Supabase free tier is easiest) and run migrations
- [ ] Deploy: Vercel (frontend), Render (backend + ML service) — see tech stack notes below
- [ ] Write your project report — the "data source" and "why synthetic data" explanation
      above is your methodology section starting point
- [ ] Take real screenshots of the running app for your report (docs/screenshots/)
- [ ] Optional: retrain the model with more realistic capacity thresholds if you get
      access to any real approximate ridership numbers for calibration

## Deployment quick reference

| Service | Where | Notes |
|---|---|---|
| Frontend | Vercel | `npm run build`, output dir `dist/` |
| Backend | Render | Needs `DATABASE_URL`, `ML_API_URL`, `JWT_SECRET` env vars |
| ML Service | Render | Use `gunicorn app:app` in production instead of `python app.py` |
| Database | Neon / Supabase | Free tier is enough for a student project |

---

## Tech Stack

React 19 · TypeScript · Tailwind CSS · Framer Motion · React Router · Axios ·
Node.js · Express · Socket.IO · JWT · bcrypt · PostgreSQL · Prisma ·
Python · Pandas · NumPy · scikit-learn · XGBoost · SHAP · Flask ·
Leaflet + OpenStreetMap · Apache ECharts (via echarts-for-react)
