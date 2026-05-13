const BASE = "http://localhost:8000";

export const getPhysicians = () => fetch(`${BASE}/physicians`).then(r => r.json());
export const getSlots = (physicianId) => fetch(`${BASE}/physicians/${physicianId}/slots`).then(r => r.json());
export const createBooking = (data) => fetch(`${BASE}/appointments`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
}).then(r => { if (!r.ok) throw new Error("Booking failed"); return r.json(); });
export const getAppointments = () => fetch(`${BASE}/appointments`).then(r => r.json());
export const updateStatus = (id, status) => fetch(`${BASE}/appointments/${id}/status`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status })
}).then(r => {
  if (!r.ok)
    throw new Error("Status update failed");

  return r.json();
});