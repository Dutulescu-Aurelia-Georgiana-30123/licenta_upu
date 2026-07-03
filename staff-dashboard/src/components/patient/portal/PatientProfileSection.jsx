import { useState } from "react";
import axios from "axios";

export default function PatientProfileSection({ user, login, isMobile }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "P";

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCancelEdit = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhoneNumber(user?.phoneNumber || "");
    setEmail(user?.email || "");
    setProfileImage(user?.profileImage || "");
    setEditing(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      const res = await axios.put(
        `http://localhost:8081/auth/users/${user.id}/profile`,
        {
          email: email.trim() || null,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: phoneNumber.trim(),
          profileImage: profileImage || null,
          specialization: user?.specialization || null,
          professionalGrade: user?.professionalGrade || null,
          profileSignature: user?.profileSignature || null,
          profileSignedAt: user?.profileSignedAt || null,
        }
      );

      login(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Nu s-a putut actualiza profilul.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "0.95fr 1.55fr",
        gap: 22,
      }}
    >
      <div style={profileCardStyle}>
        <div style={profileTopWaveStyle} />

        <div style={avatarWrapperStyle}>
          <div style={avatarStyle}>
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profil pacient"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              initials
            )}
          </div>

          {editing && (
            <label style={cameraButtonStyle}>
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          )}
        </div>

        <h2 style={patientNameStyle}>
          {firstName || "Pacient"} {lastName || ""}
        </h2>

        <div style={patientBadgeStyle}>🛡️ Cont pacient</div>

        <div style={profileDividerStyle} />

        <InfoLine icon="✉️" text={email || "-"} />
        <InfoLine icon="🪪" text={`CNP: ${user?.cnp || "-"}`} />
        <InfoLine icon="📞" text={`Telefon: ${phoneNumber || "-"}`} />

        {!editing && (
          <button onClick={() => setEditing(true)} style={primaryButtonStyle}>
            ✎ Editează profilul
          </button>
        )}
      </div>

      <div style={detailsCardStyle}>
        <div style={sectionHeaderStyle}>
          <div style={sectionIconStyle}>📋</div>
          <div>
            <h3 style={sectionTitleStyle}>Date personale</h3>
            <div style={sectionSubtitleStyle}>
              Informațiile principale ale pacientului
            </div>
          </div>
        </div>

        {!editing ? (
          <div style={{ marginTop: 20 }}>
            <DataRow icon="👤" label="Nume" value={lastName} />
            <DataRow icon="👤" label="Prenume" value={firstName} />
            <DataRow icon="✉️" label="Email" value={email} />
            <DataRow icon="🪪" label="CNP" value={user?.cnp} />
            <DataRow icon="📞" label="Telefon" value={phoneNumber} />
          </div>
        ) : (
          <div style={{ marginTop: 22 }}>
            <EditField label="Nume">
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={editInputStyle}
              />
            </EditField>

            <EditField label="Prenume">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={editInputStyle}
              />
            </EditField>

            <EditField label="Email">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={editInputStyle}
              />
            </EditField>

            <EditField label="Telefon">
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={editInputStyle}
              />
            </EditField>

            <DataRow icon="🪪" label="CNP" value={user?.cnp} />

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                style={{
                  ...primaryButtonStyle,
                  marginTop: 0,
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Se salvează..." : "Salvează"}
              </button>

              <button
                onClick={handleCancelEdit}
                disabled={saving}
                style={secondaryButtonStyle}
              >
                Renunță
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoLine({ icon, text }) {
  return (
    <div style={infoLineStyle}>
      <span style={infoIconStyle}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function DataRow({ icon, label, value }) {
  return (
    <div style={dataRowStyle}>
      <div style={dataLeftStyle}>
        <div style={dataIconStyle}>{icon}</div>
        <span>{label}</span>
      </div>

      <strong style={dataValueStyle}>{value || "-"}</strong>
    </div>
  );
}

function EditField({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <div style={editLabelStyle}>{label}</div>
      {children}
    </label>
  );
}

const profileCardStyle = {
  position: "relative",
  overflow: "hidden",
  minHeight: 420,
  padding: 30,
  borderRadius: 30,
  background: "rgba(255,255,255,0.96)",
  border: "1px solid #e5eef8",
  boxShadow: "0 22px 55px rgba(15,47,95,0.08)",
};

const profileTopWaveStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 130,
  background:
    "radial-gradient(circle at top left, rgba(8,184,179,0.20), transparent 35%), linear-gradient(135deg, rgba(230,255,253,0.95), rgba(255,255,255,0.4))",
};

const avatarWrapperStyle = {
  position: "relative",
  width: 118,
  height: 118,
  margin: "34px auto 18px",
};

const avatarStyle = {
  width: 118,
  height: 118,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #08b8b3, #069a96)",
  display: "grid",
  placeItems: "center",
  color: "white",
  fontSize: 42,
  fontWeight: 950,
  boxShadow: "0 18px 38px rgba(8,184,179,0.25)",
  overflow: "hidden",
};

const cameraButtonStyle = {
  position: "absolute",
  right: -4,
  bottom: 8,
  width: 38,
  height: 38,
  borderRadius: "50%",
  background: "white",
  border: "1px solid #e5eef8",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  boxShadow: "0 10px 22px rgba(15,47,95,0.12)",
};

const patientNameStyle = {
  margin: "0 0 10px",
  textAlign: "center",
  color: "#102033",
  fontSize: 26,
  fontWeight: 950,
  letterSpacing: -0.6,
};

const patientBadgeStyle = {
  width: "fit-content",
  margin: "0 auto",
  padding: "8px 14px",
  borderRadius: 999,
  background: "#e6fffd",
  color: "#069a96",
  fontSize: 13,
  fontWeight: 950,
};

const profileDividerStyle = {
  height: 1,
  background: "#e5eef8",
  margin: "26px 0",
};

const infoLineStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  color: "#475569",
  fontSize: 14,
  fontWeight: 750,
  marginBottom: 16,
};

const infoIconStyle = {
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  color: "#069a96",
};

const detailsCardStyle = {
  padding: 30,
  borderRadius: 30,
  background: "rgba(255,255,255,0.96)",
  border: "1px solid #e5eef8",
  boxShadow: "0 22px 55px rgba(15,47,95,0.08)",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const sectionIconStyle = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  background: "#e6fffd",
  color: "#069a96",
  display: "grid",
  placeItems: "center",
  fontSize: 22,
};

const sectionTitleStyle = {
  margin: 0,
  color: "#102033",
  fontSize: 23,
  fontWeight: 950,
  letterSpacing: -0.4,
};

const sectionSubtitleStyle = {
  marginTop: 4,
  color: "#64748b",
  fontSize: 13,
  fontWeight: 700,
};

const dataRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 18,
  padding: "15px 0",
  borderBottom: "1px solid #edf2f7",
};

const dataLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  color: "#64748b",
  fontWeight: 850,
};

const dataIconStyle = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  background: "#e6fffd",
  color: "#069a96",
  display: "grid",
  placeItems: "center",
};

const dataValueStyle = {
  color: "#102033",
  fontSize: 15,
  textAlign: "right",
};

const primaryButtonStyle = {
  width: "100%",
  marginTop: 24,
  padding: "14px 18px",
  borderRadius: 16,
  border: "none",
  background: "linear-gradient(135deg, #08b8b3, #069a96)",
  color: "white",
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 16px 34px rgba(8,184,179,0.22)",
};

const secondaryButtonStyle = {
  padding: "13px 18px",
  borderRadius: 16,
  border: "1px solid #dbeafe",
  background: "white",
  color: "#334155",
  fontWeight: 900,
  cursor: "pointer",
};

const editLabelStyle = {
  color: "#64748b",
  fontSize: 13,
  fontWeight: 900,
  marginBottom: 7,
};

const editInputStyle = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#102033",
  outline: "none",
  fontWeight: 750,
  boxSizing: "border-box",
};