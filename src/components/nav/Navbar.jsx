import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/holidazebluelogo.svg";

export default function Navbar() {
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
          <NavLink to="/login" className="nav-link">
            Log in
          </NavLink>
          <NavLink to="/register" className="nav-link">
            Register
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
