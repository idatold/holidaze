// src/components/nav/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/holidazebluelogo.svg";
import UserMenu from "@/components/nav/UserMenu.jsx";
import MobileMenu from "@/components/nav/MobileMenu.jsx";
import { PROFILE_NAME_KEY, AUTH_CHANGED_EVENT } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const name = localStorage.getItem(PROFILE_NAME_KEY);
      setIsLoggedIn(Boolean(name));
    };
    check();

    window.addEventListener("storage", check); // cross-tab
    window.addEventListener(AUTH_CHANGED_EVENT, check); // same-tab
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener(AUTH_CHANGED_EVENT, check);
    };
  }, []);

  return (
    <header className="bg-[#FAF6F4] shadow-md">
      {/* align items to the bottom like your desktop header */}
      <nav className="container mx-auto flex items-end justify-between px-4 py-3">
        <Link to="/" className="flex items-end gap-2">
          <img src={logo} alt="Holidaze" className="w-[150px] h-[63px]" />
        </Link>

        {/* Desktop (≥sm) */}
        <div className="hidden sm:flex items-center gap-5">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/venues" className="nav-link">
            Venues
          </NavLink>
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Log in
              </NavLink>
              <NavLink to="/register" className="nav-link">
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile (<sm): bottom-aligned hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen} // ← add
          aria-controls="mobile-menu" // ← add
          className="sm:hidden self-end rounded-[5px] p-2 hover:shadow-sm active:scale-[0.98] focus:outline-none -mb-[2px]"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="#006492"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="2" rx="1" />
            <rect x="3" y="11" width="18" height="2" rx="1" />
            <rect x="3" y="17" width="18" height="2" rx="1" />
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <MobileMenu
          isLoggedIn={isLoggedIn}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}
