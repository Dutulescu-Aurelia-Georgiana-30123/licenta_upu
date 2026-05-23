import { useState } from "react";
import axios from "axios";
import Card from "./Card";
import EditField from "./EditField";
import PatientInfoRow from "./PatientInfoRow";
import {
  avatarStyle,
  editInput,
  patientBadgeStyle,
  patientNameStyle,
  primaryButtonStyle,
  profileGridStyle,
  secondaryButtonStyle,
  singleColumnGridStyle,
} from "../../../styles/patientPortalStyles";

export default function PatientProfileSection({ user, login, isMobile }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");

  const initials =
    firstName?.[0] || lastName?.[0] || email?.[0]?.toUpperCase() || "P";

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
    <div style={isMobile ? singleColumnGridStyle : profileGridStyle}>
      <Card>
        <div style={{ textAlign: "center" }}>
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

          <h2 style={patientNameStyle}>
            {firstName || "Pacient"} {lastName || ""}
          </h2>

          <div style={patientBadgeStyle}>Cont pacient</div>
        </div>
      </Card>

      <Card
        title="Date personale"
        subtitle="Informațiile principale ale pacientului"
      >
        {!editing ? (
          <>
            <PatientInfoRow label="Nume" value={lastName} />
            <PatientInfoRow label="Prenume" value={firstName} />
            <PatientInfoRow label="Email" value={email} />
            <PatientInfoRow label="CNP" value={user?.cnp} />
            <PatientInfoRow label="Telefon" value={phoneNumber} />

            <button onClick={() => setEditing(true)} style={primaryButtonStyle}>
              Editează profilul
            </button>
          </>
        ) : (
          <>
            <EditField label="Poză de profil">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={editInput}
              />
            </EditField>

            <EditField label="Nume">
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={editInput}
              />
            </EditField>

            <EditField label="Prenume">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={editInput}
              />
            </EditField>

            <EditField label="Email">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={editInput}
                placeholder="email@exemplu.ro"
              />
            </EditField>

            <EditField label="Telefon">
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={editInput}
              />
            </EditField>

            <PatientInfoRow label="CNP" value={user?.cnp} />

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                style={{
                  ...primaryButtonStyle,
                  marginTop: 4,
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
          </>
        )}
      </Card>
    </div>
  );
}