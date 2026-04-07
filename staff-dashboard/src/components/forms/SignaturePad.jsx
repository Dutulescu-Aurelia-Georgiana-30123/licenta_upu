import { useEffect, useRef, useState } from "react";

export default function SignaturePad({
  title,
  nameValue,
  onNameChange,
  signatureValue,
  onSignatureChange,
  signedAtValue,
  onSignedAtChange,
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
    ctx.strokeStyle = "#000000";
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
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPoint(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    onSignatureChange(canvas.toDataURL("image/png"));
    onSignedAtChange(new Date().toISOString());
  };

  const clearSignature = () => {
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
        border: "1px solid #333",
        borderRadius: 12,
        padding: 14,
        background: "#121212",
      }}
    >
      <h4 style={{ marginTop: 0, marginBottom: 12 }}>{title}</h4>

      <label style={{ display: "block", marginBottom: 12 }}>
        <div style={{ marginBottom: 6 }}>Nume</div>
        <input
          value={nameValue}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Introdu numele complet"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#111",
            color: "#eaeaea",
            boxSizing: "border-box",
          }}
        />
      </label>

      <div ref={wrapperRef}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: 160,
            border: "1px dashed #555",
            borderRadius: 8,
            background: "#ffffff",
            touchAction: "none",
            cursor: "crosshair",
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

      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button type="button" onClick={clearSignature} style={{ padding: "8px 12px" }}>
          Șterge semnătura
        </button>
      </div>

      <div style={{ marginTop: 10, color: "#aaa", fontSize: 13 }}>
        {signedAtValue
          ? `Semnat la: ${new Date(signedAtValue).toLocaleString("ro-RO")}`
          : "Semnătura nu a fost aplicată încă."}
      </div>
    </div>
  );
}