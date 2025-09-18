// src/components/nav/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/holidazebluelogo.svg";
import UserMenu from "@/components/nav/UserMenu.jsx";
import { PROFILE_NAME_KEY, AUTH_CHANGED_EVENT } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const check = () => {
      const name = localStorage.getItem(PROFILE_NAME_KEY);
      setIsLoggedIn(Boolean(name));
    };
    check();

    window.addEventListener("storage", check);               // cross-tab
    window.addEventListener(AUTH_CHANGED_EVENT, check);      // same-tab

    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener(AUTH_CHANGED_EVENT, check);
    };
  }, []);

  return (
    <header className="bg-[#FAF6F4] shadow-md">
      <nav className="container mx-auto flex items-end justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Holidaze" className="w-[150px] h-[63px]" />
        </Link>

        <div className="flex items-center gap-5">
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
              <NavLink to="/login" className="nav-link">Log in</NavLink>
              <NavLink to="/register" className="nav-link">Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
