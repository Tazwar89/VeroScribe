from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from database import Base

class StatusEnum(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"

class Physician(Base):
    __tablename__ = "physicians"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    slots = relationship("AppointmentSlot", back_populates="physician")

class AppointmentSlot(Base):
    __tablename__ = "appointment_slots"
    id = Column(Integer, primary_key=True)
    physician_id = Column(Integer, ForeignKey("physicians.id"))
    date_time = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=30)
    is_available = Column(Boolean, default=True)
    physician = relationship("Physician", back_populates="slots")

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String)
    appointments = relationship("Appointment", back_populates="patient")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    slot_id = Column(Integer, ForeignKey("appointment_slots.id"))
    reason_for_visit = Column(String, nullable=False)
    status = Column(Enum(StatusEnum), default=StatusEnum.pending)
    patient = relationship("Patient", back_populates="appointments")
    slot = relationship("AppointmentSlot")