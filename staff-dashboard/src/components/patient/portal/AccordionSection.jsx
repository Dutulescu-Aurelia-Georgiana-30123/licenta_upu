import {
  accordionArrowStyle,
  accordionButtonStyle,
} from "../../../styles/patientPortalStyles";

export default function AccordionSection({
  title,
  open,
  setOpen,
  children,
}) {
  return (
    <>
      <button
        onClick={() => setOpen((value) => !value)}
        style={accordionButtonStyle}
      >
        <span>
          <strong>{title}</strong>
        </span>

        <span style={accordionArrowStyle}>
          {open ? "Restrânge" : "Extinde"}
        </span>
      </button>

      {open && <div style={{ marginTop: 18 }}>{children}</div>}
    </>
  );
}