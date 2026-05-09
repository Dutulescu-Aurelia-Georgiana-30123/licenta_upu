import { theme } from "../../styles/theme";

export default function SectionCard({
  title,
  isOpen,
  onToggle,
  children,
  hideTopButtonWhenOpen = false,
}) {
  const showTopButton = !isOpen || !hideTopButtonWhenOpen;

  return (
    <div style={theme.card.base}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: isOpen ? 16 : 0,
          borderBottom: isOpen ? `1px solid ${theme.colors.border}` : "none",
          marginBottom: isOpen ? 16 : 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: theme.colors.text,
            fontSize: 18,
            fontWeight: 900,
          }}
        >
          {title}
        </h3>

        {showTopButton && (
          <button onClick={onToggle} style={theme.button.secondary}>
            {isOpen ? "Restrânge" : "Extinde"}
          </button>
        )}
      </div>

      {isOpen && <div>{children}</div>}
    </div>
  );
}