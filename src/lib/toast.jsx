// src/lib/toast.jsx
import { toast as rt, Zoom } from "react-toastify";

/* ─────────────────────────  Base opts  ───────────────────────── */
const baseOpts = {
  theme: "light",
  pauseOnHover: true,
  transition: Zoom,   
  autoClose: 3200,    
  draggable: false,   
};

/* ─────────────────────────  Shared classes  ───────────────────────── */
const bodyClass = "font-arsenal text-ink";

const boxClass  = "rounded-[12px] bg-white shadow-lg " + bodyClass;

/* explicit brand frame (tailwind-only) */
const boxPink   = boxClass + " border-2 border-pink";

/* Buttons (reuse your design system) */
const btnOutlinePink = "btn btn-outline-pink uppercase";
const btnPink        = "btn btn-pink uppercase";

/* ─────────────────────────  Icon for Toastify icon slot  ─────────────────────────
   Self-colored SVG: pink filled circle + white check (no reliance on currentColor).
*/
function SvgPinkCheck({ className = "h-5 w-5 shrink-0" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" focusable="false">
      {/* hard-fill to brand pink so it cannot turn black */}
      <circle cx="10" cy="10" r="10" fill="#D23393" />
      <path
        d="M5.5 10.5l2.5 2.5 6-6"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Convenience: brand notification defaults (success/error/info) */
const brandNotify = (fn, message, opts = {}) =>
  fn(message, {
    ...baseOpts,
    position: "bottom-right",
    className: boxPink + " toast-brand",       // pink frame
    bodyClassName: "flex items-center gap-2",  // alignment + spacing
    icon: <SvgPinkCheck />,                    // use Toastify icon slot (kept)
    progressClassName: "toast-progress-pink",  // bold pink bar (CSS in index.css)
    ...opts,
  });

/* ─────────────────────────  Bottom-right toasts  ───────────────────────── */
function success(message, opts) {
  return brandNotify(rt.success, message, opts);
}
function error(message, opts) {
  return brandNotify(rt.error, message, opts);
}
function info(message, opts) {
  return brandNotify(rt, message, opts);
}

/* Mini, subtle success that still uses the icon slot */
function miniSuccess(message, opts) {
  return rt.success(message, {
    ...baseOpts,
    position: "bottom-right",
    className: boxPink + " toast-brand toast-mini",
    bodyClassName: "flex items-center gap-2",
    icon: <SvgPinkCheck />,            // pink circle here too
    hideProgressBar: true,
    autoClose: 2200,                   // slightly longer than before
    closeOnClick: true,
    ...opts,
  });
}

/* ─────────────────────────  Centered confirm  ─────────────────────────
   Clean confirm (no icon in the corner).
*/
function confirm({
  title = "Are you sure?",
  message = "",
  link, // { href, label? }
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
} = {}) {
  const id = rt(
    <div className="min-w-0">
      {title ? <div className="mb-1 font-semibold">{title}</div> : null}
      {(message || link?.href) ? (
        <div className="mb-3 space-y-2 text-sm text-ink/80">
          {message ? <p>{message}</p> : null}
          {link?.href ? (
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-pink underline underline-offset-2"
            >
              {link.label || "Preview image"} <span aria-hidden>↗</span>
            </a>
          ) : null}
        </div>
      ) : null}
      <div className="mt-1 flex gap-3">
        <button
          className={btnOutlinePink}
          onClick={() => {
            rt.dismiss(id);
            onCancel?.();
          }}
        >
          {cancelText}
        </button>
        <button
          className={btnPink}
          onClick={() => {
            rt.dismiss(id);
            onConfirm?.();
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>,
    {
      ...baseOpts,
      containerId: "center",
      autoClose: false,
      closeOnClick: false,
      className: boxPink + " toast-brand",
      bodyClassName: "flex flex-col",
      // no icon here
    }
  );
  return id;
}

/* ─────────────────────────  Public API  ───────────────────────── */
const toast = { success, error, info, miniSuccess, confirm };
export default toast;
