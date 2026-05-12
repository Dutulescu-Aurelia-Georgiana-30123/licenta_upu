import { theme } from "../../styles/theme";
import { getStatusLabel } from "../../utils/visitStatus";
import { getTriageLabel, getTriageStyle } from "../../utils/triage";

export function StatusBadge({ status }) {
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "6px 10px",
        borderRadius: 999,
        background: theme.colors.primarySoft,
        color: theme.colors.primaryDark,
        fontSize: 12,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {getStatusLabel(status)}
    </span>
  );
}

export function TriageBadge({ triageColor }) {
  const style = getTriageStyle(triageColor);

  return (
    <span
      style={{
        display: "inline-flex",
        padding: "6px 10px",
        borderRadius: 999,
        background: style.background,
        color: style.color,
        fontSize: 12,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {getTriageLabel(triageColor)}
    </span>
  );
}