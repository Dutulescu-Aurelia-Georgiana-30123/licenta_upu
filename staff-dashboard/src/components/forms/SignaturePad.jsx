import { useEffect, useRef, useState } from "react";
import { theme } from "../../styles/theme";

export default function SignaturePad({
  title,
  nameValue,
  onNameChange,
  signatureValue,
  onSignatureChange,
  signedAtValue,
  onSignedAtChange,
  readOnly = false,
}) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const paintWhiteBackground = (ctx, canvas) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const setupContext = (ctx) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0f172a";
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const savedImage = signatureValue || "";

    canvas.width = wrapper.clientWidth;
    canvas.height = 160;

    const ctx = canvas.getContext("2d");
    setupContext(ctx);
    paintWhiteBackground(ctx, canvas);

    if (savedImage) {
      const img = new Image();
      img.onload = () => {
        paintWhiteBackground(ctx, canvas);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = savedImage;
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    resizeCanvas();
  }, [signatureValue]);

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    if (readOnly) return;

    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setupContext(ctx);

    const { x, y } = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (readOnly || !isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPoint(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (readOnly || !isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    onSignatureChange(canvas.toDataURL("image/png"));
    onSignedAtChange(new Date().toISOString());
  };

  const clearSignature = () => {
    if (readOnly) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    paintWhiteBackground(ctx, canvas);
    setupContext(ctx);

    onSignatureChange("");
    onSignedAtChange(null);
  };

  return (
    <div
      style={{
        background: "#f8fafc",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.xl,
        padding: 16,
      }}
    >
      <h4
        style={{
          marginTop: 0,
          marginBottom: 14,
          color: theme.colors.text,
          fontSize: 16,
          fontWeight: 900,
        }}
      >
        {title}
      </h4>

      <label style={{ display: "block", marginBottom: 12 }}>
        <div
          style={{
            marginBottom: 6,
            color: theme.colors.muted,
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          Nume
        </div>

        <input
          value={nameValue}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Introdu numele complet"
          disabled={readOnly}
          style={{
            ...theme.input.base,
            width: "100%",
            opacity: readOnly ? 0.75 : 1,
          }}
        />
      </label>

      <div ref={wrapperRef}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: 160,
            border: "1px dashed #cbd5e1",
            borderRadius: theme.radius.lg,
            background: "#ffffff",
            touchAction: "none",
            cursor: readOnly ? "default" : "crosshair",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {!readOnly && (
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button type="button" onClick={clearSignature} style={theme.button.secondary}>
            Șterge semnătura
          </button>
        </div>
      )}

      <div
        style={{
          marginTop: 10,
          color: signedAtValue ? theme.colors.successText : theme.colors.muted,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {signedAtValue
          ? `Semnat la: ${new Date(signedAtValue).toLocaleString("ro-RO")}`
          : "Semnătura nu a fost aplicată încă."}
      </div>
    </div>
  );
}