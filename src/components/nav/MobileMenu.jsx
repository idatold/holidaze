// src/components/nav/MobileMenu.jsx
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/holidazebluelogo.svg";
import toast from "@/lib/toast";
import {
  PROFILE_NAME_KEY,
  PROFILE_EMAIL_KEY,
  AVATAR_KEY,
  clearAuth,
} from "@/lib/auth";

export default function MobileMenu({ isLoggedIn, onClose }) {
  const navigate = useNavigate();
  const firstRender = useRef(true);

  const name = localStorage.getItem(PROFILE_NAME_KEY) || "";
  const email = localStorage.getItem(PROFILE_EMAIL_KEY) || "";
  const avatarUrl = localStorage.getItem(AVATAR_KEY) || "";

  // Prevent background scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // NOTE: Removed "close on route change" effect to avoid instant close on open.
  // If you want it later, we can re-add with a safe guard.

  function goto(path) {
    navigate(path);
    onClose?.();
  }

  function handleLogout() {
    toast.confirm({
      title: "Log out?",
      message: "Hope to see you again soon!",
      confirmText: "Log out",
      cancelText: "Stay logged in",
      onConfirm: () => {
        clearAuth();
        toast.miniSuccess("Logged out");
        goto("/login");
      },
    });
  }

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Dim background */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Slide-down full-width panel */}
      <div
        className="absolute inset-x-0 top-0 origin-top animate-[mobileSheet_.16s_ease-out] rounded-b-[5px] bg-[#FAF6F4] p-4 shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top row */}
        <div className="flex items-end justify-between">
          <Link to="/" onClick={() => goto("/")} className="flex items-end gap-2">
            <img src={logo} alt="Holidaze" className="h-[40px] w-auto" />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-[5px] p-2 hover:shadow-sm active:scale-[0.98] focus:outline-none"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#006492" aria-hidden="true">
              <path d="M6.4 5l12.6 12.6-1.4 1.4L5 6.4 6.4 5z" />
              <path d="M18.6 5L5.9 17.6l1.4 1.4L20 6.4 18.6 5z" />
            </svg>
          </button>
        </div>

        {/* User block (avatar + name/email) */}
        {isLoggedIn && (
          <button
            onClick={() => goto("/profile")}
            className="mt-3 w-full rounded-[5px] bg-white px-3 py-2 text-left shadow ring-1 ring-black/5 hover:shadow-md active:scale-[0.99] transition"
          >
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name ? `${name} avatar` : "User avatar"}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-black/5"
                  draggable="false"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[#79BAEC] text-white grid place-items-center ring-1 ring-black/5">
                  <span className="text-sm font-bold">{name.slice(0,2).toUpperCase()}</span>
                </div>
              )}
              <div>
                <div className="text-sm font-semibold text-[#006492]">{name}</div>
                <div className="text-[11px] text-gray-500">{email}</div>
              </div>
            </div>
          </button>
        )}

        {/* Nav links */}
        <nav className="mt-3">
          <button
            onClick={() => goto("/")}
            className="block w-full text-left px-1 py-2 nav-link !no-underline"
          >
            Home
          </button>
          <button
            onClick={() => goto("/venues")}
            className="block w-full text-left px-1 py-2 nav-link !no-underline"
          >
            Venues
          </button>

          <div className="my-3 h-px bg-[#e6dad3]" />

          {isLoggedIn ? (
            <>
              {/* Same links as desktop dropdown */}
              <button
                onClick={() => goto("/profile")}
                className="block w-full text-left rounded px-2 py-2 text-sm text-[#006492] hover:bg-white"
              >
                My profile
              </button>
              <button
                onClick={() => goto("/profile#bookings")}
                className="block w-full text-left rounded px-2 py-2 text-sm text-[#006492] hover:bg-white"
              >
                My bookings
              </button>
              <button
                onClick={() => goto("/profile#venues")}
                className="block w-full text-left rounded px-2 py-2 text-sm text-[#006492] hover:bg-white"
              >
                My venues
              </button>
              <button
                onClick={handleLogout}
                className="mt-1 block w-full text-left rounded px-2 py-2 text-sm text-[#D23393] hover:bg-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => goto("/login")}
                className="block w-full text-left rounded px-2 py-2 text-sm text-[#006492] hover:bg-white"
              >
                Log in
              </button>
              <button
                onClick={() => goto("/register")}
                className="block w-full text-left rounded px-2 py-2 text-sm text-[#006492] hover:bg-white"
              >
                Register
              </button>
            </>
          )}
        </nav>
      </div>

      {/* keyframes for the animation */}
      <style>{`
        @keyframes mobileSheet {
          from { transform: translateY(-8px); opacity: .0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}
