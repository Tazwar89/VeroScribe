import { useState } from 'react'
import reactLogo from '/src/assets/react.svg'
import viteLogo from '/src/assets/vite.svg'
import heroImg from '/src/assets/hero.png'
import '/src/App.css'
import PatientFlow from "/src/pages/PatientFlow";
import AdminDashboard from "/src/pages/AdminDashboard";

export default function App() {
  const [tab, setTab] = useState("patient");

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1>VeroScribe Booking</h1>
      <div>
        <button onClick={() => setTab("patient")} disabled={tab === "patient"}>Book Appointment</button>
        <button onClick={() => setTab("admin")} disabled={tab === "admin"} style={{ marginLeft: 8 }}>Admin Dashboard</button>
      </div>
      <hr />
      {tab === "patient" ? <PatientFlow /> : <AdminDashboard />}
    </div>
  );
}