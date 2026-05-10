import { theme } from "../../styles/theme";

function getRoleLabel(role) {
  if (role === "DOCTOR") return "Medic";
  if (role === "NURSE") return "Asistent(ă)";
  return role || "-";
}

export default function MedicalHeader({ user, onLogout }) {
  return (
    <div
      style={{
        ...theme.card.base,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 18,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 13px",
            borderRadius: 999,
            background: theme.colors.primarySoft,
            color: theme.colors.primaryDark,
            fontWeight: 900,
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          🩺 Interfață medicală
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: 32,
            color: theme.colors.text,
            letterSpacing: -1,
          }}
        >
          Workspace medic/asistent
        </h2>

        <p
          style={{
            marginTop: 8,
            marginBottom: 0,
            color: theme.colors.muted,
            fontWeight: 700,
          }}
        >
          Gestionare pacienți activi, fișe medicale și istoric clinic.
        </p>
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
            gap: 12,
            padding: "12px 15px",
            borderRadius: 22,
            background: "#f8fafc",
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #08b8b3, #069a96)",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 950,
              boxShadow: theme.shadow.teal,
            }}
          >
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>

          <div>
            <div
              style={{
                color: theme.colors.text,
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              {user?.email || "-"}
            </div>

            <div
              style={{
                color: theme.colors.primaryDark,
                fontWeight: 900,
                fontSize: 12,
                marginTop: 3,
              }}
            >
              {getRoleLabel(user?.role)}
            </div>
          </div>
        </div>

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