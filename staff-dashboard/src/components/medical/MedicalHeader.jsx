import { theme } from "../../styles/theme";

function getRoleLabel(role) {
  if (role === "DOCTOR") return "Medic";
  if (role === "NURSE") return "Asistent(ă)";
  return role || "-";
}

export default function MedicalHeader({
  user,
  onLogout,
  availabilityStatus,
  onAvailabilityChange,
}) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 18,
        flexWrap: "wrap",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.7)",
        borderRadius: 26,
        padding: "18px 24px",
        boxShadow: "0 12px 40px rgba(15, 23, 42, 0.06)",
        boxSizing: "border-box",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: "#102033",
            letterSpacing: -0.7,
          }}
        >
          Interfață medicală
        </div>

        <div
          style={{
            marginTop: 4,
            color: "#6b7280",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Workspace pentru pacienți activi, fișe medicale și istoric clinic
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background:
              "linear-gradient(135deg, rgba(8,184,179,0.12), rgba(8,184,179,0.03))",
            border: "1px solid rgba(8,184,179,0.14)",
            padding: "12px 18px",
            borderRadius: 20,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #08b8b3, #069a96)",
              display: "grid",
              placeItems: "center",
              color: "white",
              fontWeight: 900,
              fontSize: 18,
              boxShadow: "0 10px 24px rgba(8,184,179,0.22)",
            }}
          >
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>

          <div>
            <div
              style={{
                fontWeight: 800,
                color: "#102033",
                fontSize: 14,
              }}
            >
              {user?.email || "-"}
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#069a96",
                fontWeight: 700,
                marginTop: 2,
              }}
            >
              {getRoleLabel(user?.role)}
            </div>
          </div>
        </div>

<button
  type="button"
  onClick={() =>
    onAvailabilityChange(
      availabilityStatus === "AVAILABLE" ? "BUSY" : "AVAILABLE"
    )
  }
  style={{
    padding: "12px 15px",
    borderRadius: 16,
    border:
      availabilityStatus === "AVAILABLE"
        ? "1px solid #bbf7d0"
        : "1px solid #fecaca",
    background:
      availabilityStatus === "AVAILABLE" ? "#dcfce7" : "#fee2e2",
    color:
      availabilityStatus === "AVAILABLE" ? "#166534" : "#991b1b",
    fontWeight: 900,
    cursor: "pointer",
  }}
>
  {availabilityStatus === "AVAILABLE"
    ? "Disponibil"
    : "Indisponibil"}
</button>

        <button
          onClick={onLogout}
          style={{
            ...theme.button.ghost,
            padding: "12px 15px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}