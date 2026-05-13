import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import PatientFlow from "./pages/PatientFlow";
import AdminDashboard from "./pages/AdminDashboard";

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