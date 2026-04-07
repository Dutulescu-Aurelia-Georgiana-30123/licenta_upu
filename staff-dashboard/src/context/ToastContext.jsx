import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (message, type = "info") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const showSuccess = (msg) => addToast(msg, "success");
  const showError = (msg) => addToast(msg, "error");
  const showInfo = (msg) => addToast(msg, "info");

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}

      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => {
          const colors = {
            success: { bg: "#1f3d2b", border: "#22c55e" },
            error: { bg: "#3d1f1f", border: "#ef4444" },
            info: { bg: "#1f2f3d", border: "#3b82f6" },
          };

          return (
            <div
              key={t.id}
              style={{
                minWidth: 250,
                padding: "10px 14px",
                borderRadius: 10,
                border: `1px solid ${colors[t.type].border}`,
                background: colors[t.type].bg,
                color: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);