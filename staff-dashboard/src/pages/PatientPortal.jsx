import { useAuth } from "../context/AuthContext";

const teal = "#08b8b3";
const tealDark = "#069a96";

function Card({ title, subtitle, children, style = {} }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid #e5eef8",
        borderRadius: 28,
        padding: 22,
        boxShadow: "0 22px 55px rgba(15, 47, 95, 0.08)",
        backdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {title && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#102033" }}>
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: 13,
                color: "#667085",
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}

function PatientInfoRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "13px 0",
        borderBottom: "1px solid #edf2f7",
      }}
    >
      <span style={{ color: "#667085", fontWeight: 700 }}>{label}</span>
      <span style={{ color: "#102033", fontWeight: 900 }}>
        {value || "—"}
      </span>
    </div>
  );
}

export default function PatientPortal() {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: 26,
        background: `
          radial-gradient(circle at top left, rgba(8,184,179,0.18), transparent 28%),
          radial-gradient(circle at bottom right, rgba(37,99,235,0.10), transparent 32%),
          linear-gradient(135deg, #f4fffe 0%, #f8fbff 45%, #eef7ff 100%)
        `,
      }}
    >
      <div
        style={{
          width: "100%",
          marginBottom: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.7)",
          borderRadius: 26,
          padding: "18px 24px",
          boxShadow: "0 12px 40px rgba(15, 23, 42, 0.06)",
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
            Portal pacient
          </div>

          <div
            style={{
              marginTop: 4,
              color: "#6b7280",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Acces la date personale, vizite și documente medicale
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            border: "none",
            background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
            color: "white",
            padding: "12px 16px",
            borderRadius: 16,
            fontWeight: 950,
            cursor: "pointer",
            boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          maxWidth: 1500,
          margin: "0 auto",
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(20px)",
          borderRadius: 34,
          padding: 28,
          border: "1px solid rgba(255,255,255,0.8)",
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.8fr 1.2fr",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          <Card>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  margin: "0 auto",
                  background: "linear-gradient(135deg, #08b8b3, #069a96)",
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  fontWeight: 950,
                  fontSize: 42,
                  boxShadow: "0 20px 45px rgba(8,184,179,0.28)",
                }}
              >
                {user?.firstName?.[0] ||
                  user?.lastName?.[0] ||
                  user?.email?.[0]?.toUpperCase() ||
                  "P"}
              </div>

              <h2
                style={{
                  margin: "18px 0 4px",
                  color: "#102033",
                  fontSize: 25,
                  fontWeight: 950,
                }}
              >
                {user?.firstName || "Pacient"} {user?.lastName || ""}
              </h2>

              <div
                style={{
                  color: tealDark,
                  fontSize: 13,
                  fontWeight: 900,
                  background: "#e6fffd",
                  display: "inline-block",
                  padding: "7px 12px",
                  borderRadius: 999,
                  marginTop: 8,
                }}
              >
                Cont pacient
              </div>
            </div>
          </Card>

          <Card
            title="Date personale"
            subtitle="Informațiile principale ale pacientului"
          >
            <PatientInfoRow label="Nume" value={user?.lastName} />
            <PatientInfoRow label="Prenume" value={user?.firstName} />
            <PatientInfoRow label="Email" value={user?.email} />
            <PatientInfoRow label="CNP" value={user?.cnp} />
            <PatientInfoRow label="Telefon" value={user?.phone} />
          </Card>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
            marginTop: 18,
          }}
        >
          <Card
            title="Status vizită actuală"
            subtitle="Stadiul curent al vizitei tale în UPU"
          >
            <div
              style={{
                padding: 16,
                borderRadius: 20,
                background: "#e6fffd",
                color: tealDark,
                fontWeight: 950,
              }}
            >
              ● Nu există momentan o vizită activă
            </div>
          </Card>

          <Card
            title="Istoric fișe"
            subtitle="Fișele medicale generate la vizitele anterioare"
          >
            <p
              style={{
                margin: 0,
                color: "#667085",
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              Nu există încă fișe disponibile pentru acest pacient.
            </p>
          </Card>

          <Card
            title="Întreabă un medic"
            subtitle="Trimite o întrebare generală către personalul medical"
          >
            <textarea
              placeholder="Scrie întrebarea ta aici..."
              rows={4}
              style={{
                width: "100%",
                resize: "vertical",
                border: "1px solid #dbe7f3",
                borderRadius: 18,
                padding: 14,
                outline: "none",
                color: "#102033",
                fontWeight: 600,
              }}
            />

            <button
              style={{
                marginTop: 12,
                border: "none",
                background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
                color: "white",
                padding: "12px 16px",
                borderRadius: 16,
                fontWeight: 950,
                cursor: "pointer",
                boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
              }}
            >
              Trimite întrebare
            </button>
          </Card>

          <Card
            title="Spitale de urgență apropiate"
            subtitle="Hartă cu unități UPU din apropierea ta"
          >
            <div
              style={{
                height: 180,
                borderRadius: 22,
                background:
                  "linear-gradient(135deg, #eef7ff, #e6fffd)",
                display: "grid",
                placeItems: "center",
                color: "#667085",
                fontWeight: 900,
                border: "1px dashed #c8d8e8",
              }}
            >
              Harta va fi adăugată ulterior
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}