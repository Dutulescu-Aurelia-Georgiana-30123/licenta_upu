import { useState } from "react";
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
  onOpenProfile,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

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
        overflow: "visible",
        position: "relative",
        zIndex: 1000,
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
          {availabilityStatus === "AVAILABLE" ? "Disponibil" : "Indisponibil"}
        </button>

        <div style={{ position: "relative" }}>
          <div
            onClick={() => setMenuOpen((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background:
                "linear-gradient(135deg, rgba(8,184,179,0.12), rgba(8,184,179,0.03))",
              border: "1px solid rgba(8,184,179,0.14)",
              padding: "12px 18px",
              borderRadius: 20,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <div
  style={{
    width: 44,
    height: 44,
    borderRadius: "50%",
    overflow: "hidden",
    background: "linear-gradient(135deg, #08b8b3, #069a96)",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 10px 24px rgba(8,184,179,0.22)",
    flexShrink: 0,
  }}
>
  {user?.profileImage ? (
    <img
      src={user.profileImage}
      alt="Profil"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  ) : (
    <div
      style={{
        color: "white",
        fontWeight: 900,
        fontSize: 18,
      }}
    >
      {user?.firstName?.[0]?.toUpperCase() ||
        user?.email?.[0]?.toUpperCase() ||
        "U"}
    </div>
  )}
</div>

            <div>
              <div
                style={{
                  fontWeight: 800,
                  color: "#102033",
                  fontSize: 14,
                }}
              >
                {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email || "-"}

              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#069a96",
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {user?.email || getRoleLabel(user?.role)}
              </div>
            </div>

            <div
              style={{
                color: "#069a96",
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              {menuOpen ? "▲" : "▼"}
            </div>
          </div>

          {menuOpen && (
            <div
              style={{
  position: "absolute",
  top: "calc(100% + 10px)",
  right: 0,
  width: 190,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
  padding: 8,
  zIndex: 9999,
}}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenProfile && onOpenProfile();
                }}
                style={menuButtonStyle}
              >
                Profil
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                style={{
                  ...menuButtonStyle,
                  color: "#991b1b",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const menuButtonStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "none",
  borderRadius: 12,
  background: "transparent",
  textAlign: "left",
  cursor: "pointer",
  fontWeight: 800,
  color: "#102033",
};