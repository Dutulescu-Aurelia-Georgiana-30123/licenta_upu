import { useState } from "react";
import { theme } from "../styles/theme";
import { apiPut } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import SignaturePad from "../components/forms/SignaturePad";

export default function MedicalProfilePage({ user, onBack }) {
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    specialization: user?.specialization || "",
    professionalGrade: user?.professionalGrade || "",
    profileImage: user?.profileImage || "",
    profileSignature: user?.profileSignature || "",
    profileSignedAt: user?.profileSignedAt || null,
  });

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    try {
      const updatedUser = await apiPut(`/auth/users/${user.id}/profile`, profile);

      login(updatedUser);

      showSuccess("Profilul a fost salvat cu succes.");
    } catch (e) {
      console.error(e);
      showError(e.message || "Eroare la salvarea profilului.");
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.86)",
        border: "1px solid rgba(255,255,255,0.8)",
        borderRadius: 34,
        padding: 28,
        boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <button
        onClick={onBack}
        style={{
          ...theme.button.secondary,
          marginBottom: 20,
        }}
      >
        ← Înapoi
      </button>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: theme.colors.text, fontSize: 30 }}>
          Profil medical
        </h2>

        <div style={{ color: theme.colors.muted, marginTop: 6, fontWeight: 700 }}>
          Date personale, profesionale și semnătura digitală
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#f8fafc",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 28,
            padding: 20,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              margin: "0 auto 16px",
              background: profile.profileImage
                ? `url(${profile.profileImage}) center/cover`
                : "linear-gradient(135deg, #08b8b3, #069a96)",
              display: "grid",
              placeItems: "center",
              color: "white",
              fontSize: 44,
              fontWeight: 950,
              boxShadow: "0 16px 35px rgba(8,184,179,0.24)",
            }}
          >
            {!profile.profileImage &&
              (profile.firstName?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </div>

          <label
            style={{
              ...theme.button.secondary,
              display: "inline-block",
              cursor: "pointer",
            }}
          >
            Adaugă poză
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>

          <div
            style={{
              marginTop: 16,
              color: theme.colors.muted,
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 1.5,
            }}
          >
            {fullName || user?.email || "-"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <Field label="Prenume">
            <input
              value={profile.firstName}
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
              }
              style={inputStyle}
            />
          </Field>

          <Field label="Nume">
            <input
              value={profile.lastName}
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
              style={inputStyle}
            />
          </Field>

          <Field label="Email">
            <input
              value={user?.email || ""}
              readOnly
              style={{ ...inputStyle, opacity: 0.7 }}
            />
          </Field>

          <Field label="Telefon">
            <input
              value={profile.phoneNumber}
              onChange={(e) =>
                setProfile({ ...profile, phoneNumber: e.target.value })
              }
              style={inputStyle}
            />
          </Field>

          <Field label="Specializare">
            <input
              placeholder="ex: Medicină de urgență"
              value={profile.specialization}
              onChange={(e) =>
                setProfile({ ...profile, specialization: e.target.value })
              }
              style={inputStyle}
            />
          </Field>

          <Field label="Grad profesional">
            <input
              placeholder="ex: Medic specialist / Primar / Rezident"
              value={profile.professionalGrade}
              onChange={(e) =>
                setProfile({ ...profile, professionalGrade: e.target.value })
              }
              style={inputStyle}
            />
          </Field>

          <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
            <SignaturePad
              title="Semnătura mea"
              nameValue={fullName}
              onNameChange={() => {}}
              signatureValue={profile.profileSignature}
              onSignatureChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  profileSignature: value,
                }))
              }
              signedAtValue={profile.profileSignedAt}
              onSignedAtChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  profileSignedAt: value,
                }))
              }
              readOnly={false}
            />
          </div>

          <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
            <button onClick={saveProfile} style={theme.button.primary}>
              Salvează profilul
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label>
      <div
        style={{
          marginBottom: 7,
          color: theme.colors.text,
          fontSize: 13,
          fontWeight: 900,
        }}
      >
        {label}
      </div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#102033",
  outline: "none",
  fontWeight: 800,
};