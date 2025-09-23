import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PROFILE_NAME_KEY, AUTH_CHANGED_EVENT } from "@/lib/auth";
import logo from "@/assets/holidazewhitelogo.svg";

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const check = () => setIsLoggedIn(Boolean(localStorage.getItem(PROFILE_NAME_KEY)));
    check();
    window.addEventListener("storage", check);
    window.addEventListener(AUTH_CHANGED_EVENT, check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener(AUTH_CHANGED_EVENT, check);
    };
  }, []);

  return (
    <footer className="mt-12 bg-[#006492] text-white">
      <div className="container mx-auto px-4 pt-10 pb-4 text-center">
        {/* Logo */}
        <img
          src={logo}
          alt="Holidaze"
          className="mx-auto w-[129px] h-[59px] mb-6"
        />

        {/* Navigation */}
        <div className="flex justify-center gap-8 mb-6">
          <Link to="/" className="text-base font-semibold hover:underline">
            Home
          </Link>
          <Link to="/venues" className="text-base font-semibold hover:underline">
            Venues
          </Link>

          {isLoggedIn ? (
            <Link to="/profile" className="text-base font-semibold hover:underline">
              Profile
            </Link>
          ) : (
            <Link to="/login" className="text-base font-semibold hover:underline">
              Login
            </Link>
          )}
        </div>

        {/* Divider line */}
        <div className="w-full border-t border-white my-4" />

        {/* Copyright */}
        <p className="text-white text-sm italic mt-12">
          &copy; {new Date().getFullYear()} <em>Holidaze™</em>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
