import { useState, useEffect, useCallback } from "react";
import { getAppointments, updateStatus } from "../api";

const STATUS_COLORS = { pending: "orange", confirmed: "green", cancelled: "gray" };
const NEXT_ACTIONS = { pending: ["confirmed", "cancelled"], confirmed: ["cancelled"], cancelled: [] };

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    getAppointments().then(data => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const handle = async (id, status) => {
    setError(null);

    try {
      await updateStatus(id, status);
      await load();
    }

    catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h2>Upcoming Appointments</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        appointments.map(a => (
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
        ))
      )}
    </div>
  );
}