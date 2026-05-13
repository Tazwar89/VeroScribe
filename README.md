# VeroScribe

A patient appointment booking system with a patient-facing flow and a physician/admin dashboard.

## System Design

<img width="1122" height="812" alt="SysDes" src="https://github.com/user-attachments/assets/d7653448-41ec-4bda-a9b4-96673ad5fdf6" />

---

## How to Run

**Requirements:** Python 3.11+, Node.js 20+

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

UI runs at `http://localhost:5173`

> The database (`booking.db`) is created automatically on first run and seeded with 2 physicians and 7 days of appointment slots.

---

## What I Built

A full-stack appointment booking system with two views:

**Patient flow** — three-step process: choose a physician, select an available time slot, submit name/email/phone/reason for visit. On success, displays the appointment ID and pending status.

**Admin dashboard** — lists all appointments with patient details, slot time, reason for visit, and current status. Admins can confirm or cancel pending appointments, and cancel confirmed ones. Cancelled appointments release their slot back to available.

**Backend:** FastAPI + SQLAlchemy + SQLite. Four tables: `physicians`, `appointment_slots`, `patients`, `appointments`. The API is documented automatically via `/docs`.

**Frontend:** React 19 + Vite, plain `fetch`, no UI library. Two pages (`PatientFlow`, `AdminDashboard`) accessed via tab navigation in `App.jsx`.

---

## Key Technical and Product Decisions

**SQLite over an in-memory store** — persists data across server restarts during development without requiring a running database process. The same SQLAlchemy models work against Postgres with a one-line connection string change.

**Slot-based availability model** — appointment slots are pre-seeded entities with an `is_available` flag rather than computing availability dynamically. This makes double-booking prevention simple and atomic: the slot is marked unavailable in the same transaction as the appointment insert.

**Status transition guard on the backend** — `PUT /appointments/:id/status` enforces a valid state machine (`pending → confirmed → cancelled`, `confirmed → cancelled`) rather than accepting arbitrary status values. This keeps the business rule in one place regardless of what client is calling the API.

**`reason_for_visit` on `Appointment`, not `Patient`** — a patient's reason for visiting is per-appointment, not a permanent patient attribute. This allows the same patient to book future appointments with different reasons.

**No auth** — per the brief, authentication was explicitly out of scope. The admin dashboard is accessible via a tab toggle. In production this would be behind role-based auth.

---

## What I Would Improve with More Time

**Input validation on the frontend** — the booking form currently submits even with empty required fields; adding inline validation before the API call would improve the patient experience.

**Idempotent patient creation** — currently each booking creates a new patient row. A real system would look up a patient by email first and reuse their record, avoiding duplicate patients for repeat bookings.

**Pagination and filtering on the admin dashboard** — with real data volumes, the appointments list would need pagination and filters by date, physician, and status.

**Timezone handling** — slots are stored and returned as naive datetimes. Storing as UTC and converting to the user's local timezone on the frontend would prevent display bugs for users in different time zones.

**Slot generation UX** — the seed script generates fixed slots. An admin interface to add/remove physician availability would be needed before this could be used in practice.
