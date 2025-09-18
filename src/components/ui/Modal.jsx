// src/components/ui/Modal.jsx
import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, footer, className = "" }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose?.(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative z-10 w-full max-w-lg rounded-[8px] bg-white shadow-lg ${className}`}>
        {/* header (no border) */}
        <div className="flex items-center justify-between px-5 py-3">
          <h3 className="font-higuen text-ocean text-lg">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded p-2 text-ocean/70 hover:bg-black/5">✕</button>
        </div>

        {/* body */}
        <div className="px-5 py-4">{children}</div>

        {/* footer (no border) */}
        {footer && <div className="px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
