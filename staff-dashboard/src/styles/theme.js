export const theme = {
  colors: {
    primary: "#08b8b3",
    primaryDark: "#069a96",
    primarySoft: "#e6fffd",

    text: "#102033",
    muted: "#667085",
    border: "#e5eef8",
    surface: "#ffffff",
    input: "#f8fafc",

    danger: "#dc2626",
    dangerSoft: "#fee2e2",

    successText: "#166534",
    successSoft: "#dcfce7",
  },

  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    xxl: 28,
    hero: 34,
  },

  shadow: {
    sm: "0 6px 16px rgba(15, 47, 95, 0.06)",
    md: "0 14px 30px rgba(15, 47, 95, 0.08)",
    lg: "0 22px 55px rgba(15, 47, 95, 0.08)",
    teal: "0 14px 30px rgba(8, 184, 179, 0.24)",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  typography: {
    pageTitle: {
      margin: 0,
      fontSize: 34,
      letterSpacing: -1.1,
      lineHeight: 1.1,
      fontWeight: 950,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: 950,
    },

    label: {
      fontSize: 13,
      fontWeight: 800,
    },
  },

  card: {
    base: {
      background: "rgba(255,255,255,0.92)",
      border: "1px solid #e5eef8",
      borderRadius: 28,
      padding: 22,
      boxShadow: "0 22px 55px rgba(15, 47, 95, 0.08)",
      backdropFilter: "blur(14px)",
    },
  },

  button: {
    primary: {
      padding: "12px 16px",
      borderRadius: 16,
      border: "none",
      background: "linear-gradient(135deg, #08b8b3, #069a96)",
      color: "white",
      fontWeight: 950,
      cursor: "pointer",
      boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
    },

    secondary: {
      padding: "11px 15px",
      borderRadius: 16,
      border: "1px solid rgba(8,184,179,0.25)",
      background: "#e6fffd",
      color: "#069a96",
      fontWeight: 900,
      cursor: "pointer",
    },

    ghost: {
      padding: "10px 13px",
      borderRadius: 14,
      border: "1px solid #e2e8f0",
      background: "#ffffff",
      color: "#334155",
      fontWeight: 900,
      cursor: "pointer",
    },
  },

  input: {
    base: {
      boxSizing: "border-box",
      padding: "12px 14px",
      borderRadius: 16,
      border: "1px solid #e2e8f0",
      background: "#f8fafc",
      color: "#102033",
      outline: "none",
      fontWeight: 800,
    },
  },
};