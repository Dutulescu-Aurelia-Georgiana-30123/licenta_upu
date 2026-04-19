export default function MedicalHeader({ user, onLogout }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ marginBottom: 6 }}>Interfață Medicală</h2>
      <p style={{ marginTop: 0, color: "#aaa" }}>Logat ca: {user.email}</p>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}