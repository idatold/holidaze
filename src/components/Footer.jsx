import { Link } from "react-router-dom";
import logo from "@/assets/holidazewhitelogo.svg";

export default function Footer() {
  return (
    <footer className="mt-12 bg-[#006492] text-white">
      <div className="container mx-auto px-4 py-10 text-center">
        <img src={logo} alt="Holidaze" className="mx-auto h-8 mb-4" />
        <div className="flex justify-center gap-6 mb-6">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/venues" className="footer-link">Venues</Link>
          <Link to="/about" className="footer-link">About</Link>
          <Link to="/login" className="footer-link">Login</Link>
        </div>
        <p className="text-white/70 text-[11px]">&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p>
      </div>
    </footer>
  );
}
