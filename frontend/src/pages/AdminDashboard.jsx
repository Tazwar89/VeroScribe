import { useState, useEffect } from "react";
import { getAppointments, updateStatus } from "../api";

const STATUS_COLORS = { pending: "orange", confirmed: "green", cancelled: "gray" };
const NEXT_ACTIONS = { pending: ["confirmed", "cancelled"], confirmed: ["cancelled"], cancelled: [] };

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);

  const load = () => getAppointments().then(setAppointments);
  useEffect(() => { load(); }, []);

  const handle = async (id, status) => {
    await updateStatus(id, status);
    load();
  };

  return (
    <div>
      <h2>Upcoming Appointments</h2>
      {appointments.length === 0 && <p>No appointments yet.</p>}
      {appointments.map(a => (
        <div key={a.id} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 8 }}>
          <strong>{a.patient.name}</strong> ({a.patient.email})<br />
          <span>Slot: {new Date(a.slot.date_time).toLocaleString()}</span><br />
          <span>Reason: {a.reason_for_visit}</span><br />
          <span style={{ color: STATUS_COLORS[a.status] }}>Status: {a.status}</span><br />
          {NEXT_ACTIONS[a.status].map(s => (
            <button key={s} onClick={() => handle(a.id, s)} style={{ marginRight: 4, marginTop: 4 }}>
              Mark {s}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}