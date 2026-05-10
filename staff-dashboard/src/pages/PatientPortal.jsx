import { useAuth } from "../context/AuthContext";

export default function PatientPortal() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h2>Portal pacient</h2>

      <p>Logat ca: {user?.email}</p>

      <button
        onClick={logout}
        style={{
          marginTop: 10,
          padding: "6px 10px",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}