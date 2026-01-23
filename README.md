# 🚛 ELD Log Generator (Full-Stack Application)

This project is a **full-stack ELD (Electronic Logging Device) Log Generator** that simulates driver Hours of Service (HOS) logs and visualizes trip routes on a map.

It includes:

* A **Django REST backend** for HOS calculations
* A **React + Vite frontend** for log visualization and map routing
* Compliance-oriented assumptions aligned with **FMCSA HOS rules**

---

## 📌 Features Overview

### ✅ Backend (Django + DRF)

* Calculates **daily ELD logs** based on trip distance
* Supports:

  * Driving
  * On-Duty (pickup/drop-off)
  * Off-Duty
  * Sleeper Berth (optional)
* Enforces:

  * 11-hour driving limit per day
  * Mandatory 30-minute break after 8 driving hours
  * 10-hour consecutive rest (off-duty or sleeper)
* Handles **multi-day trips**
* Sleeper berth logic:

  * Enabled only when explicitly selected
  * Used only for long overnight rest
  * Daily sleeper time capped at 10 hours

---

### ✅ Frontend (React + Vite)

* Trip input form:

  * Current location
  * Pickup location
  * Dropoff location
  * Cycle hours already used
  * Sleeper berth option (≥ 7 hrs)
* **Paper-style ELD log grid** (24-hour format)
* Color-coded duty statuses:

  * 🟦 Off Duty
  * 🟪 Sleeper
  * 🟩 Driving
  * 🟨 On Duty
* **Route map visualization**:

  * Current → Pickup → Dropoff
  * Distinct colored markers (C / P / D)
  * Animated route drawing
  * Fuel stop markers every 1000 miles (assumed)
* Fully responsive UI (desktop + mobile)

---

## 🧠 Key Design Decisions & Assumptions

### Backend Considerations

* Distance is currently **mocked** (map API ready for future integration)
* Trip duration is derived from:

  ```
  distance / average_speed (55 mph)
  ```
* Even short trips generate **at least one full log day**
* Sleeper berth:

  * Not auto-assigned
  * Only applied if driver opts in
  * Used for overnight rest, not short breaks

### Frontend Considerations

* Grid always shows **full 24-hour days** (ELD standard)
* Short trips may still span multiple log days due to:

  * Mandatory rest rules
  * Day boundary handling
* Map routes are approximated using straight-line paths
* Fuel stops are **visual only** (not affecting HOS)

---

## 🗂 Project Structure

```
eld-log-app/
├── backend/
│   ├── eld_backend/
│   ├── trips/
│   ├── requirements.txt
│   ├── Procfile
│   └── manage.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── dist/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Environment Variables (Brief)

### Backend

Create a `.env` file inside `backend/`:

```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend

Create `.env` inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_MAPBOX_TOKEN=your_mapbox_token
```

---

## ▶️ Running the Project Locally

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🚀 Deployment Summary

### Backend (Render – Web Service)

* Root directory: `backend`
* Build command:

  ```
  pip install -r requirements.txt
  ```
* Start command:

  ```
  gunicorn eld_backend.wsgi
  ```
* Procfile:

  ```
  web: gunicorn eld_backend.wsgi
  ```

---

### Frontend (Render – Static Site)

* Root directory: `frontend`
* Build command:

  ```
  npm run build
  ```
* Publish directory:

  ```
  dist
  ```

---

## 📈 Future Enhancements

* Real map routing (Mapbox Directions API)
* Distance-based HOS calculation
* Violation detection (11/14/70 hour limits)
* Export logs as PDF
* Authentication & saved trips

---

## ✅ Assignment Compliance Summary

✔ Full-stack implementation
✔ Clear separation of frontend & backend
✔ HOS logic implemented with constraints
✔ Visual ELD paper logs
✔ Route map visualization
✔ Deployment-ready structure
✔ Documented assumptions & design choices

---

## 👨‍💻 Author
Pradeep Simha

Built as part of an **ELD Log Generator assignment**, focusing on correctness, clarity, and extensibility.
