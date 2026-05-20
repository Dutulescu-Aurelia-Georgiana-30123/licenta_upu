import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NearbyHospitalsMap from "../components/patient/NearbyHospitalsMap";

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
  const { user, logout, login } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [activeVisit, setActiveVisit] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);
  const [documentsByVisit, setDocumentsByVisit] = useState({});
  const [visitLoading, setVisitLoading] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionLoading, setQuestionLoading] = useState(true);
  const [questionSending, setQuestionSending] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");

  useEffect(() => {
    const loadPatientData = async () => {
      if (!user?.cnp) {
        setVisitLoading(false);
        setQuestionLoading(false);
        return;
      }

      try {
        const activeRes = await axios.get(
          `http://localhost:8081/visits/by-cnp/${user.cnp}/active`
        );

        setActiveVisit(activeRes.data || null);

        const historyRes = await axios.get(
          `http://localhost:8081/visits/by-cnp/${user.cnp}`
        );

        const visits = historyRes.data || [];
        setVisitHistory(visits);

        const docsMap = {};

        for (const visit of visits) {
          try {
            const docsRes = await axios.get(
              `http://localhost:8081/archived-documents/visit/${visit.id}`
            );

            docsMap[visit.id] = docsRes.data || [];
          } catch {
            docsMap[visit.id] = [];
          }
        }

        setDocumentsByVisit(docsMap);
      } catch (err) {
        console.error(err);
        setActiveVisit(null);
        setVisitHistory([]);
        setDocumentsByVisit({});
      } finally {
        setVisitLoading(false);
      }

      try {
        const questionsRes = await axios.get(
          `http://localhost:8081/patient-questions/by-cnp/${user.cnp}`
        );

        setQuestions(questionsRes.data || []);
      } catch (err) {
        console.error(err);
        setQuestions([]);
      } finally {
        setQuestionLoading(false);
      }
    };

    loadPatientData();

const interval = setInterval(() => {
  loadPatientData();
}, 7000);

return () => clearInterval(interval);
}, [user?.cnp]);

  const reloadQuestions = async () => {
    if (!user?.cnp) return;

    try {
      const questionsRes = await axios.get(
        `http://localhost:8081/patient-questions/by-cnp/${user.cnp}`
      );

      setQuestions(questionsRes.data || []);
    } catch (err) {
      console.error(err);
      setQuestions([]);
    }
  };

  const handleSendQuestion = async () => {
    const cleanText = questionText.trim();

    if (!cleanText) {
      alert("Scrie întrebarea înainte de trimitere.");
      return;
    }

    setQuestionSending(true);

    try {
      await axios.post(
        `http://localhost:8081/patient-questions/by-cnp/${user.cnp}`,
        {
          questionText: cleanText,
        }
      );

      setQuestionText("");
      await reloadQuestions();
    } catch (err) {
      console.error(err);
      alert("Nu s-a putut trimite întrebarea.");
    } finally {
      setQuestionSending(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };

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

  const initials =
    firstName?.[0] ||
    lastName?.[0] ||
    email?.[0]?.toUpperCase() ||
    "P";

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

        <button onClick={logout} style={logoutButtonStyle}>
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

              <h2
                style={{
                  margin: "18px 0 4px",
                  color: "#102033",
                  fontSize: 25,
                  fontWeight: 950,
                }}
              >
                {firstName || "Pacient"} {lastName || ""}
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
                <div style={{ marginBottom: 14 }}>
                  <div style={editLabel}>Poză de profil</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={editInput}
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={editLabel}>Nume</div>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={editInput}
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={editLabel}>Prenume</div>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={editInput}
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={editLabel}>Email</div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={editInput}
                    placeholder="email@exemplu.ro"
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={editLabel}>Telefon</div>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={editInput}
                  />
                </div>

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
  {visitLoading ? (
    <div style={statusBoxStyle}>Se încarcă vizita...</div>
  ) : activeVisit ? (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={activeVisitBoxStyle}>
        Status curent: {formatVisitStatus(activeVisit.status)}
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 20,
          background: getTriageBackground(activeVisit.triageColor),
          border: `2px solid ${getTriageColor(activeVisit.triageColor)}`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            marginBottom: 6,
            color: getTriageColor(activeVisit.triageColor),
          }}
        >
          COD DE TRIAJ
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 950,
            color: getTriageColor(activeVisit.triageColor),
          }}
        >
          {activeVisit.triageColor || "Neatribuit"}
        </div>
      </div>

      <PatientInfoRow label="Cod vizită" value={activeVisit.visitCode} />

      <PatientInfoRow
        label="Data înregistrării"
        value={formatDateTime(activeVisit.createdAt)}
      />

      <PatientInfoRow
        label="Motiv prezentare"
        value={activeVisit.presentationReason}
      />

      <PatientInfoRow label="Medic" value={activeVisit.doctorEmail} />
    </div>
  ) : (
    <div style={statusBoxStyle}>
      Nu există momentan o vizită activă.
    </div>
  )}
</Card>

          <Card
            title="Istoric vizite"
            subtitle="Vizitele și fișele medicale ale pacientului"
          >
            {visitLoading ? (
              <div style={statusBoxStyle}>Se încarcă istoricul...</div>
            ) : visitHistory.length === 0 ? (
              <p
                style={{
                  margin: 0,
                  color: "#667085",
                  fontWeight: 700,
                  lineHeight: 1.6,
                }}
              >
                Nu există încă vizite înregistrate.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {visitHistory.map((visit) => (
                  <div
                    key={visit.id}
                    style={{
                      border: "1px solid #e5eef8",
                      borderRadius: 18,
                      padding: 16,
                      background: "#f8fbff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 900,
                          color: "#102033",
                          fontSize: 15,
                        }}
                      >
                        {visit.visitCode}
                      </div>

                      <div
                        style={{
                          background: "#e6fffd",
                          color: tealDark,
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontWeight: 900,
                          fontSize: 12,
                        }}
                      >
                        {formatVisitStatus(visit.status)}
                      </div>
                    </div>

                    <PatientInfoRow
                      label="Data"
                      value={formatDateTime(visit.createdAt)}
                    />

                    <PatientInfoRow
                      label="Medic"
                      value={visit.doctorEmail || "Nealocat"}
                    />

                    <PatientInfoRow
                      label="Motiv prezentare"
                      value={visit.presentationReason || "—"}
                    />

                    <PatientInfoRow
                      label="Cod triaj"
                      value={visit.triageColor || "—"}
                    />

                    {documentsByVisit[visit.id]?.length > 0 ? (
                      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                        {documentsByVisit[visit.id].map((doc) => (
                          <div
                            key={doc.id}
                            style={{
                              display: "flex",
                              gap: 10,
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              onClick={() =>
                                window.open(
                                  `http://localhost:8081/archived-documents/${doc.id}/view`,
                                  "_blank"
                                )
                              }
                              style={{
                                border: "1px solid #dbe7f3",
                                background: "#eef7ff",
                                color: "#102033",
                                padding: "10px 14px",
                                borderRadius: 14,
                                fontWeight: 900,
                                cursor: "pointer",
                              }}
                            >
                              Previzualizează fișa
                            </button>

                            <button
                              onClick={() =>
                                window.open(
                                  `http://localhost:8081/archived-documents/${doc.id}/download`,
                                  "_blank"
                                )
                              }
                              style={{
                                border: "none",
                                background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
                                color: "white",
                                padding: "10px 14px",
                                borderRadius: 14,
                                fontWeight: 900,
                                cursor: "pointer",
                                boxShadow: "0 10px 24px rgba(8,184,179,0.18)",
                              }}
                            >
                              Descarcă fișa
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          marginTop: 12,
                          color: "#94a3b8",
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        Nu există încă fișă PDF pentru această vizită.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            title="Întreabă un medic"
            subtitle="Trimite o întrebare generală către personalul medical"
          >
            <textarea
              placeholder="Scrie întrebarea ta aici..."
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
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
              onClick={handleSendQuestion}
              disabled={questionSending}
              style={{
                ...askButtonStyle,
                opacity: questionSending ? 0.7 : 1,
                cursor: questionSending ? "not-allowed" : "pointer",
              }}
            >
              {questionSending ? "Se trimite..." : "Trimite întrebare"}
            </button>

            <div style={{ marginTop: 18 }}>
              <div
                style={{
                  fontWeight: 900,
                  color: "#102033",
                  marginBottom: 10,
                }}
              >
                Întrebările mele
              </div>

              {questionLoading ? (
                <div style={statusBoxStyle}>Se încarcă întrebările...</div>
              ) : questions.length === 0 ? (
                <div
                  style={{
                    color: "#667085",
                    fontWeight: 700,
                    lineHeight: 1.6,
                  }}
                >
                  Nu ai trimis încă întrebări.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      style={{
                        border: "1px solid #e5eef8",
                        borderRadius: 18,
                        padding: 14,
                        background: "#f8fbff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            color: "#667085",
                            fontWeight: 800,
                          }}
                        >
                          {formatDateTime(q.createdAt)}
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 900,
                            color: q.status === "ANSWERED" ? "#166534" : "#92400e",
                            background:
                              q.status === "ANSWERED" ? "#dcfce7" : "#fef3c7",
                            padding: "5px 9px",
                            borderRadius: 999,
                          }}
                        >
                          {q.status === "ANSWERED" ? "Răspunsă" : "În așteptare"}
                        </div>
                      </div>

                      <div
                        style={{
                          color: "#102033",
                          fontWeight: 800,
                          lineHeight: 1.5,
                        }}
                      >
                        {q.questionText}
                      </div>

                      {q.answerText && (
                        <div
                          style={{
                            marginTop: 10,
                            padding: 12,
                            borderRadius: 14,
                            background: "#e6fffd",
                            color: "#0f766e",
                            fontWeight: 700,
                            lineHeight: 1.5,
                          }}
                        >
                          <div style={{ fontWeight: 950, marginBottom: 4 }}>
                            Răspuns medic
                          </div>
                          {q.answerText}

                          {q.answeredByName && (
                            <div
                              style={{
                                marginTop: 8,
                                fontSize: 12,
                                color: "#069a96",
                                fontWeight: 900,
                              }}
                            >
                              Răspuns oferit de: {q.answeredByName}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card
  title="Spitale de urgență apropiate"
  subtitle="Hartă cu unități medicale de urgență"
>
  <NearbyHospitalsMap />
</Card>
        </div>
      </div>
    </div>
  );
}

function formatVisitStatus(status) {
  const labels = {
    REGISTERED: "Înregistrat",
    WAITING_CONSULT: "În așteptare pentru consultație",
    IN_CONSULT: "În consultație",
    DISCHARGED: "Externat",
    ADMITTED: "Internat",
    TRANSFERRED: "Transferat",
  };

  return labels[status] || status || "—";
}

function getTriageColor(color) {
  switch (color) {
    case "ROSU":
      return "#dc2626";

    case "GALBEN":
      return "#ca8a04";

    case "VERDE":
      return "#16a34a";

    default:
      return "#64748b";
  }
}

function getTriageBackground(color) {
  switch (color) {
    case "ROSU":
      return "#fee2e2";

    case "GALBEN":
      return "#fef9c3";

    case "VERDE":
      return "#dcfce7";

    default:
      return "#f1f5f9";
  }
}

function formatDateTime(value) {
  if (!value) return "—";

  return new Date(value).toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const avatarStyle = {
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
  overflow: "hidden",
};

const logoutButtonStyle = {
  border: "none",
  background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
  color: "white",
  padding: "12px 16px",
  borderRadius: 16,
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
};

const primaryButtonStyle = {
  marginTop: 18,
  border: "none",
  background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
  color: "white",
  padding: "12px 16px",
  borderRadius: 16,
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(8,184,179,0.18)",
};

const secondaryButtonStyle = {
  marginTop: 4,
  border: "1px solid #dbe7f3",
  background: "white",
  color: "#102033",
  padding: "12px 16px",
  borderRadius: 16,
  fontWeight: 900,
  cursor: "pointer",
};

const askButtonStyle = {
  marginTop: 12,
  border: "none",
  background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
  color: "white",
  padding: "12px 16px",
  borderRadius: 16,
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
};

const editLabel = {
  marginBottom: 6,
  color: "#667085",
  fontWeight: 800,
  fontSize: 13,
};

const editInput = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid #dbe7f3",
  outline: "none",
  fontWeight: 700,
  fontSize: 14,
  boxSizing: "border-box",
};

const statusBoxStyle = {
  padding: 16,
  borderRadius: 20,
  background: "#e6fffd",
  color: tealDark,
  fontWeight: 950,
};

const activeVisitBoxStyle = {
  padding: 16,
  borderRadius: 20,
  background: "#e6fffd",
  color: tealDark,
  fontWeight: 950,
};