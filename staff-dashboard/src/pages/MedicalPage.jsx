import { apiPut } from "../api/api";
import { useState } from "react";
export default function MedicalPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [status, setStatus] = useState("AVAILABLE");
  const toggleAvailability = async () => {
  const newStatus = status === "AVAILABLE" ? "BUSY" : "AVAILABLE";

  try {
    await apiPut(`/auth/users/${user.id}/availability`, {
      availabilityStatus: newStatus,
    });

    setStatus(newStatus);
  } catch (e) {
    alert("Eroare la actualizare status");
  }
};
  const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.reload();
};

  return (
    <div style={{ padding: 20 }}>
      <h2>Interfață Medic</h2>
      <p>Logat ca: {user.email}</p>

      <button
  onClick={handleLogout}
  style={{
    marginTop: 10,
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  }}
>
  Logout
</button>
<button
  onClick={toggleAvailability}
  style={{
    marginTop: 10,
    marginLeft: 10,
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  }}
>
  Status: {status}
</button>

      <div style={{ marginTop: 20 }}>
        <button style={{ marginRight: 10 }}>
          Pacienți în așteptare
        </button>

        <button style={{ marginRight: 10 }}>
          Pacienții mei
        </button>

        <button>
          Fișe
        </button>
      </div>
    </div>
  );
}