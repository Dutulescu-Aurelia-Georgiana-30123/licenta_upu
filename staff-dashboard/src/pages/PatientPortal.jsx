export default function PatientPortal() {
  const user = JSON.parse(localStorage.getItem("user"));
  const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.reload();
};

  return (
    <div style={{ padding: 20 }}>
      <h2>Portal pacient</h2>
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
    </div>
  );
}