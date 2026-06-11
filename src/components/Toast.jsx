export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
      background: toast.color || "#6366f1", color: "#fff", padding: "10px 20px",
      borderRadius: 24, zIndex: 999, fontWeight: 700, fontSize: 13,
      boxShadow: "0 4px 24px rgba(0,0,0,0.6)", whiteSpace: "nowrap",
      maxWidth: "85vw", textAlign: "center", pointerEvents: "none",
    }}>
      {toast.msg}
    </div>
  );
}
