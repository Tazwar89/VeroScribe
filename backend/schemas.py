from pydantic import BaseModel, EmailStr
from datetime import datetime
from models import StatusEnum

class PhysicianOut(BaseModel):
    id: int
    name: str
    specialty: str
    model_config = {"from_attributes": True}

class SlotOut(BaseModel):
    id: int
    physician_id: int
    date_time: datetime
    duration_minutes: int
    is_available: bool
    model_config = {"from_attributes": True}

class BookingRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    slot_id: int
    reason_for_visit: str

class AppointmentOut(BaseModel):
    id: int
    status: StatusEnum
    reason_for_visit: str
    patient: "PatientOut"
    slot: SlotOut
    model_config = {"from_attributes": True}

class PatientOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None
    model_config = {"from_attributes": True}

class StatusUpdate(BaseModel):
    status: StatusEnum