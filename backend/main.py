from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db, Base
import models, schemas, seed

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        seed.seed_db(db)
        yield

    finally:
        db.close()

app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the VeroScribe API", "status": "running"}

# --- Physician & Slots ---
@app.get("/physicians", response_model=list[schemas.PhysicianOut])
def list_physicians(db: Session = Depends(get_db)):
    return db.query(models.Physician).all()

@app.get("/physicians/{physician_id}/slots", response_model=list[schemas.SlotOut])
def available_slots(physician_id: int, db: Session = Depends(get_db)):
    return db.query(models.AppointmentSlot).filter(
        models.AppointmentSlot.physician_id == physician_id,
        models.AppointmentSlot.is_available == True
    ).all()

# --- Booking ---
@app.post("/appointments", response_model=schemas.AppointmentOut, status_code=201)
def create_booking(req: schemas.BookingRequest, db: Session = Depends(get_db)):
    slot = db.query(models.AppointmentSlot).filter_by(id=req.slot_id, is_available=True).first()

    if not slot:
        raise HTTPException(400, "Slot unavailable or already booked")

    patient = models.Patient(name=req.name, email=req.email, phone=req.phone)
    db.add(patient)
    db.flush()  # get patient.id before committing

    appointment = models.Appointment(
        patient_id=patient.id,
        slot_id=slot.id,
        reason_for_visit=req.reason_for_visit
    )
    slot.is_available = False
    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment

# --- Admin ---
@app.get("/appointments", response_model=list[schemas.AppointmentOut])
def list_appointments(db: Session = Depends(get_db)):
    return db.query(models.Appointment).all()

@app.put("/appointments/{appointment_id}/status", response_model=schemas.AppointmentOut)
def update_status(appointment_id: int, body: schemas.StatusUpdate, db: Session = Depends(get_db)):
    appt = db.query(models.Appointment).filter_by(id=appointment_id).first()

    if not appt:
        raise HTTPException(404, "Appointment not found")

    # Valid transitions only
    valid = {
        "pending": ["confirmed", "cancelled"],
        "confirmed": ["cancelled"],
        "cancelled": []
    }

    if body.status not in valid[appt.status.value]:
        raise HTTPException(400, f"Cannot transition from {appt.status.value} to {body.status}")

    appt.status = body.status

    if body.status == "cancelled":
        appt.slot.is_available = True  # release the slot

    db.commit()
    db.refresh(appt)

    return appt