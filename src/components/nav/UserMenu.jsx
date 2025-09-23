import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "@/lib/toast";
import { getMyProfile } from "@/lib/authApi";
import {
  AVATAR_KEY,
  PROFILE_NAME_KEY,
  PROFILE_EMAIL_KEY,
  clearAuth,
} from "@/lib/auth";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function UserMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const n = localStorage.getItem(PROFILE_NAME_KEY) || "";
    const e = localStorage.getItem(PROFILE_EMAIL_KEY) || "";
    const a = localStorage.getItem(AVATAR_KEY) || "";
    setName(n);
    setEmail(e);
    setAvatarUrl(a);
  }, []);

  useEffect(() => {
    if (!name) return;
    let alive = true;
    getMyProfile(name, { bookings: false, venues: false })
      .then((p) => {
        if (!alive) return;
        const url = p?.avatar?.url || "";
        if (url) {
          setAvatarUrl(url);
          localStorage.setItem(AVATAR_KEY, url);
        }
        if (p?.email) {
          setEmail(p.email);
          localStorage.setItem(PROFILE_EMAIL_KEY, p.email);
        }
        setIsManager(Boolean(p?.venueManager));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [name]);

  useEffect(() => {
    if (!open || !name) return;
    let alive = true;
    getMyProfile(name, { bookings: false, venues: false })
      .then((p) => {
        if (!alive) return;
        setIsManager(Boolean(p?.venueManager));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [open, name]);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!name) return null;

  function handleLogout() {
    toast.confirm({
      title: "Log out?",
      message: "Hope to see you again soon!",
      confirmText: "Log out",
      cancelText: "Stay logged in",
      onConfirm: () => {
        clearAuth();
        toast.miniSuccess("Logged out");
        navigate("/login");
      },
    });
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-[5px] px-2 py-1 transition-[box-shadow,transform] hover:shadow-sm active:scale-[0.98] focus:outline-none"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name ? `${name} avatar` : "User avatar"}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-black/5"
            draggable="false"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-[#79BAEC] text-white grid place-items-center ring-1 ring-black/5">
            <span className="text-sm font-bold">{initials(name)}</span>
          </div>
        )}
        <span className="text-[#006492] font-semibold text-sm hidden sm:inline">
          {name}
        </span>
        <svg
          className={`h-4 w-4 text-[#006492] transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="User menu"
          className="absolute right-0 z-50 mt-2 w-48 rounded-[5px] bg-white p-2 shadow-md ring-1 ring-black/5"
        >
          {/* pointer */}
          <div className="absolute -top-1 right-6 h-2 w-2 rotate-45 bg-white ring-1 ring-black/5" />

          {/* header */}
          <div className="px-2 pb-2">
            <div className="text-sm font-semibold text-[#006492]">{name}</div>
            <div className="text-[11px] text-gray-500">{email}</div>
          </div>
          <div className="my-1 h-px bg-gray-100" />

          <Link
            to="/profile"
            role="menuitem"
            className="block rounded px-3 py-2 text-sm text-[#006492] hover:bg-gray-50"
          >
            My profile
          </Link>

          <Link
            to="/bookings"
            role="menuitem"
            className="block rounded px-3 py-2 text-sm text-[#006492] hover:bg-gray-50"
          >
            My bookings
          </Link>

          {/* Only show for venue managers */}
          {isManager && (
            <Link
              to="/my-venues"
              role="menuitem"
              className="block rounded px-3 py-2 text-sm text-[#006492] hover:bg-gray-50"
            >
              My venues
            </Link>
          )}

          <button
            onClick={handleLogout}
            role="menuitem"
            className="mt-1 w-full rounded px-3 py-2 text-left text-sm text-[#D23393] hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
