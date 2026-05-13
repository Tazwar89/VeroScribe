import { useState, useEffect } from "react";
import { getPhysicians, getSlots, createBooking } from "../api";

export default function PatientFlow() {
  const [physicians, setPhysicians] = useState([]);
  const [selectedPhysician, setSelectedPhysician] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason_for_visit: "" });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { getPhysicians().then(setPhysicians); }, []);

  const handleSelectPhysician = (p) => {
    setSelectedPhysician(p);
    setSelectedSlot(null);
    getSlots(p.id).then(setSlots);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) return setError("Please select a time slot.");
    try {
      const appt = await createBooking({ ...form, slot_id: selectedSlot.id });
      setSuccess(`Booked! Appointment #${appt.id} is ${appt.status}.`);
    } catch (e) {
      setError(e.message);
    }
  };

  if (success) return <p style={{ color: "green" }}>{success}</p>;

  return (
    <div>
      <h2>Step 1: Choose a Physician</h2>
      {physicians.map(p => (
        <button key={p.id} onClick={() => handleSelectPhysician(p)}
          style={{ marginRight: 8, fontWeight: selectedPhysician?.id === p.id ? "bold" : "normal" }}>
          {p.name} — {p.specialty}
        </button>
      ))}

      {slots.length > 0 && (
        <>
          <h2>Step 2: Select a Time Slot</h2>
          {slots.map(s => (
            <button key={s.id} onClick={() => setSelectedSlot(s)}
              style={{ display: "block", margin: "4px 0", fontWeight: selectedSlot?.id === s.id ? "bold" : "normal" }}>
              {new Date(s.date_time).toLocaleString()} ({s.duration_minutes} min)
            </button>
          ))}
        </>
      )}

      {selectedSlot && (
        <>
          <h2>Step 3: Your Details</h2>
          {["name", "email", "phone", "reason_for_visit"].map(field => (
            <div key={field}>
              <label>{field.replace("_", " ")}</label><br />
              <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
            </div>
          ))}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button onClick={handleSubmit} style={{ marginTop: 12 }}>Book Appointment</button>
        </>
      )}
    </div>
  );
}