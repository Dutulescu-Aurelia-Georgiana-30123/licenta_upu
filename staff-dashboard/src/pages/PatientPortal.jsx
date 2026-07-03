import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import NearbyHospitalsMap from "../components/patient/NearbyHospitalsMap";
import Card from "../components/patient/portal/Card";
import PatientProfileSection from "../components/patient/portal/PatientProfileSection";
import ActiveVisitCard from "../components/patient/portal/ActiveVisitCard";
import VisitHistorySection from "../components/patient/portal/VisitHistorySection";
import QuestionsSection from "../components/patient/portal/QuestionsSection";
import useIsMobile from "../hooks/useIsMobile";
import usePatientPortalData from "../hooks/usePatientPortalData";
import { apiGet } from "../api/api";

export default function PatientPortal() {
  const { user, logout, login } = useAuth();
  const isMobile = useIsMobile();

  const [activeSection, setActiveSection] = useState("profile");
  const [historyOpen, setHistoryOpen] = useState(true);
  const [questionsOpen, setQuestionsOpen] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const refreshUser = async () => {
      try {
        const freshUser = await apiGet(`/auth/users/${user.id}`);
        login(freshUser);
      } catch (err) {
        console.error("Eroare refresh date pacient:", err);
      }
    };

    refreshUser();
  }, [user?.id]);

  const {
    activeVisit,
    visitHistory,
    documentsByVisit,
    visitLoading,
    questions,
    questionText,
    setQuestionText,
    questionLoading,
    questionSending,
    handleSendQuestion,
  } = usePatientPortalData(user);

  const menuItems = [
    { key: "profile", label: "Profil", subtitle: "Date personale", icon: "👤" },
    { key: "visit", label: "Vizită actuală", subtitle: "Status și detalii", icon: "🩺" },
    { key: "history", label: "Istoric vizite", subtitle: "Vizite anterioare", icon: "📋" },
    { key: "questions", label: "Întrebări", subtitle: "Comunicare medic", icon: "💬" },
    { key: "map", label: "Hartă", subtitle: "Spitale apropiate", icon: "🗺️" },
  ];

  return (
    <div style={pageStyle}>
      <aside style={sideNavStyle}>
        <div style={sideLogoStyle}>🏥</div>

        {menuItems.map((item) => {
          const isActive = activeSection === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              style={{
                ...sideButtonStyle,
                background: isActive
                  ? "linear-gradient(135deg, #08b8b3, #069a96)"
                  : "transparent",
                color: isActive ? "white" : "#64748b",
                boxShadow: isActive
                  ? "0 16px 34px rgba(8,184,179,0.28)"
                  : "none",
              }}
            >
              {item.icon}
            </button>
          );
        })}

        <div style={{ flex: 1 }} />
      </aside>

      <main style={mainStyle}>
        <header style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Portal pacient</h1>
            <p style={subtitleStyle}>
              Acces la date personale, vizite și documente medicale
            </p>
          </div>

          <button onClick={logout} style={logoutButtonStyle}>
            Logout
          </button>
        </header>

        <section style={shellStyle}>
          <div style={menuGridStyle}>
            {menuItems.map((item) => {
              const isActive = activeSection === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  style={{
                    ...menuButtonStyle,
                    border: isActive
                      ? "1px solid rgba(8,184,179,0.75)"
                      : "1px solid #e5eef8",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(230,255,253,0.95), rgba(255,255,255,0.98))"
                      : "rgba(255,255,255,0.96)",
                  }}
                >
                  <span
                    style={{
                      ...menuIconStyle,
                      background: isActive
                        ? "linear-gradient(135deg, #08b8b3, #069a96)"
                        : "#e6fffd",
                      color: isActive ? "white" : "#069a96",
                    }}
                  >
                    {item.icon}
                  </span>

                  <span style={menuTextStyle}>{item.label}</span>
                  <span style={menuSubtitleStyle}>{item.subtitle}</span>

                </button>
              );
            })}
          </div>

          <div style={contentStyle}>
            {activeSection === "profile" && (
              <PatientProfileSection
                user={user}
                login={login}
                isMobile={isMobile}
              />
            )}

            {activeSection === "visit" && (
              <ActiveVisitCard
                activeVisit={activeVisit}
                visitLoading={visitLoading}
                isMobile={isMobile}
              />
            )}

            {activeSection === "history" && (
              <VisitHistorySection
                historyOpen={historyOpen}
                setHistoryOpen={setHistoryOpen}
                visitLoading={visitLoading}
                visitHistory={visitHistory}
                documentsByVisit={documentsByVisit}
              />
            )}

            {activeSection === "questions" && (
              <QuestionsSection
                questionsOpen={questionsOpen}
                setQuestionsOpen={setQuestionsOpen}
                questions={questions}
                questionText={questionText}
                setQuestionText={setQuestionText}
                questionLoading={questionLoading}
                questionSending={questionSending}
                handleSendQuestion={handleSendQuestion}
                isMobile={isMobile}
              />
            )}

            {activeSection === "map" && (
              <Card
                title="Spitale de urgență apropiate"
                subtitle="Hartă cu unități medicale de urgență"
              >
                <NearbyHospitalsMap />
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  background:
    "radial-gradient(circle at top left, rgba(8,184,179,0.16), transparent 30%), linear-gradient(135deg, #f6fffe 0%, #f8fbff 48%, #eef7ff 100%)",
  color: "#102033",
};

const sideNavStyle = {
  width: 78,
  minHeight: "100vh",
  padding: "24px 14px",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.82)",
  borderRight: "1px solid #e5eef8",
  boxShadow: "14px 0 45px rgba(15,47,95,0.06)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 22,
};

const sideLogoStyle = {
  fontSize: 30,
  marginBottom: 20,
};

const sideButtonStyle = {
  width: 48,
  height: 48,
  border: "none",
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  fontSize: 22,
  cursor: "pointer",
};

const securityTextStyle = {
  writingMode: "vertical-rl",
  transform: "rotate(180deg)",
  fontSize: 11,
  color: "#94a3b8",
  fontWeight: 700,
  textAlign: "center",
};

const mainStyle = {
  flex: 1,
  padding: 28,
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 22,
};

const titleStyle = {
  margin: 0,
  fontSize: 30,
  fontWeight: 950,
  color: "#102033",
  letterSpacing: -0.8,
};

const subtitleStyle = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: 15,
  fontWeight: 700,
};

const logoutButtonStyle = {
  border: "none",
  borderRadius: 18,
  padding: "14px 22px",
  background: "linear-gradient(135deg, #08b8b3, #069a96)",
  color: "white",
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 16px 34px rgba(8,184,179,0.25)",
};

const shellStyle = {
  maxWidth: 1450,
  margin: "0 auto",
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(255,255,255,0.86)",
  borderRadius: 34,
  padding: 28,
  boxShadow: "0 24px 80px rgba(15,23,42,0.08)",
  backdropFilter: "blur(20px)",
};

const menuGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(140px, 1fr))",
  gap: 18,
};

const menuButtonStyle = {
  minHeight: 138,
  borderRadius: 26,
  padding: 18,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  position: "relative",
  boxShadow: "0 18px 45px rgba(15,47,95,0.07)",
};

const menuIconStyle = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  fontSize: 25,
  marginBottom: 5,
};

const menuTextStyle = {
  fontSize: 15,
  fontWeight: 950,
  color: "#102033",
};

const menuSubtitleStyle = {
  fontSize: 12,
  color: "#64748b",
  fontWeight: 700,
};

const contentStyle = {
  marginTop: 24,
};
