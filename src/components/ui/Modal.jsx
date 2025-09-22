import { useEffect } from "react";

/**
 * Shared Modal (used for images, forms, etc.)
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - title?: string | ReactNode
 * - children: ReactNode
 * - footer?: ReactNode
 * - className?: string          // extra classes on the panel
 * - panelClassName?: string     // height/overflow utilities for tall content
 * - backdropClassName?: string  // customize backdrop (e.g., "!bg-black/50" if you ever want dark)
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className = "",
  panelClassName = "",
  backdropClassName = "",
}) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      // clicking the light area outside closes
      onMouseDown={onClose}
    >
      {/* Backdrop — default to hazy white with blur; override via backdropClassName if needed */}
      <div
        className={[
          "fixed inset-0",
          "bg-white/70 backdrop-blur-md", // ❄️ light, hazy
          backdropClassName,
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Centering wrapper. items-start on mobile so header is visible; center on sm+ */}
      <div className="min-h-full flex items-start sm:items-center justify-center" onMouseDown={(e) => e.stopPropagation()}>
        {/* Panel — no borders, deep shadow; internal scroll so tall content isn’t cut off */}
        <div
          className={[
            "relative z-10 w-full max-w-lg sm:max-w-xl",
            "rounded-2xl bg-white shadow-2xl",
            "my-4", // breathing room when scrolling
            "max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto", // internal scroll
            className,
            panelClassName,
          ].join(" ")}
        >
          {/* Header (no border) */}
          {(title || title === 0) && (
            <div className="flex items-center justify-between px-5 py-3">
              <h3 className="font-higuen text-ocean text-lg">{title}</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded p-2 text-ocean/70 hover:bg-black/5 active:scale-[0.98] focus:outline-none"
              >
                ✕
              </button>
            </div>
          )}

          {/* Body */}
          <div className="px-5 py-4">{children}</div>

          {/* Footer (no border) */}
          {footer && <div className="px-5 py-3">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
