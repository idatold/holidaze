import { useEffect, useRef, useState } from "react";

export default function CollapseSection({
  title,
  defaultOpen = false,
  persistKey,
  className = "",
  children,
}) {
  const [open, setOpen] = useState(() => {
    if (persistKey) {
      const v =
        typeof window !== "undefined" ? localStorage.getItem(persistKey) : null;
      if (v === "1") return true;
      if (v === "0") return false;
    }
    return !!defaultOpen;
  });

  const contentRef = useRef(null);
  const [maxH, setMaxH] = useState(0);

  const measure = () => {
    if (!contentRef.current) return;
    const h = contentRef.current.scrollHeight;
    setMaxH(open ? h : 0);
  };

  useEffect(() => {
    measure();

    if (!open) return;
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, children]);

  useEffect(() => {
    if (!persistKey) return;
    try {
      localStorage.setItem(persistKey, open ? "1" : "0");
    } catch {}
  }, [open, persistKey]);

  return (
    <section className={`mt-4 ${className}`}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="
          w-full flex items-center justify-between text-left
          rounded-[5px] px-3 py-2
          bg-[#E9F4FB] text-[#006492] font-semibold
          ring-1 ring-[#006492]/20
          transition hover:bg-[#E9F4FB]/90
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006492]/50
        "
      >
        <span>{title}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        style={{ maxHeight: maxH }}
        className="overflow-hidden transition-[max-height] duration-300 ease-out will-change-[max-height]"
      >
        <div ref={contentRef}>
          <div className="mt-2 rounded-[5px] bg-[#E3EFF8] p-3 sm:p-4 ring-1 ring-zinc-200">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
