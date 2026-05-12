import { theme } from "../../styles/theme";

export default function FormsToolbar({
  loading,
  exportCombined,
  readOnly = false,
  alreadyExported,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: theme.colors.text,
          }}
        >
          Acțiuni fișe
        </div>

        <div
          style={{
            marginTop: 4,
            color: theme.colors.muted,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Export și gestionare documente medicale
        </div>
      </div>

      <button
        onClick={exportCombined}
        disabled={loading || alreadyExported || readOnly}
        style={{
          ...theme.button.primary,
          opacity:
            loading || alreadyExported || readOnly ? 0.65 : 1,
          cursor:
            loading || alreadyExported || readOnly
              ? "not-allowed"
              : "pointer",
        }}
      >
        {alreadyExported
          ? "Fișa deja exportată"
          : "Export PDF combinat"}
      </button>
    </div>
  );
}