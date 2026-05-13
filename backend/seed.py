from datetime import datetime, timedelta
import models

def seed_db(db):
    if db.query(models.Physician).count() > 0:
        return  # already seeded

    physicians = [
        models.Physician(name="Dr. Sarah Chen", specialty="General Practice"),
        models.Physician(name="Dr. James Okafor", specialty="Cardiology"),
    ]
    db.add_all(physicians)
    db.flush()

    slots = []
    base = datetime.now().replace(hour=9, minute=0, second=0, microsecond=0)

    # Create slots for the next 7 days, 4 slots per day (9am, 10am, 11am, 1pm)
    for day_offset in range(7):
        for hour_offset in range(4):
            for phys in physicians:
                slots.append(models.AppointmentSlot(
                    physician_id=phys.id,
                    date_time=base + timedelta(days=day_offset, hours=hour_offset),
                    duration_minutes=30
                ))
    db.add_all(slots)
    db.commit()