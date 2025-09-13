import { useEffect, useState } from "react";

export function toast(arg = {}) {
  const opts = typeof arg === "string" ? { message: arg, variant: "info" } : arg;
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const detail = {
    id,
    title: opts.title || "",
    message: opts.message || "",
    variant: opts.variant || "info", // "info" | "success" | "error"
    duration: typeof opts.duration === "number" ? opts.duration : 3000,
  };
  window.dispatchEvent(new CustomEvent("holidaze:toast", { detail }));
}
toast.info = (msg, opts = {}) => toast({ message: msg, variant: "info", ...opts });
toast.success = (msg, opts = {}) => toast({ message: msg, variant: "success", ...opts });
toast.error = (msg, opts = {}) => toast({ message: msg, variant: "error", ...opts });

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(e) {
      const t = e.detail;
      setToasts((list) => [...list, t]);
      const timer = setTimeout(() => {
        setToasts((list) => list.filter((x) => x.id !== t.id));
      }, t.duration || 3000);
      return () => clearTimeout(timer);
    }
    window.addEventListener("holidaze:toast", onToast);
    return () => window.removeEventListener("holidaze:toast", onToast);
  }, []);

  return (
    <div aria-live="polite" className="fixed top-4 left-1/2 z-[10000] -translate-x-1/2 flex flex-col gap-3 px-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[280px] max-w-[92vw] rounded-[8px] border bg-white px-4 py-3 shadow-lg
            ${t.variant === "success" ? "border-pink-500"
              : t.variant === "error" ? "border-red-500"
              : "border-ocean-500"}`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-1 inline-block h-2 w-2 rounded-full
                ${t.variant === "success" ? "bg-pink-500"
                  : t.variant === "error" ? "bg-red-600"
                  : "bg-ocean-500"}`}
            />
            <div className="min-w-0">
              {t.title ? <div className="truncate font-semibold text-ocean-700">{t.title}</div> : null}
              {t.message ? <div className="mt-0.5 text-sm text-ocean-800">{t.message}</div> : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
