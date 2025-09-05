import { Outlet } from "react-router-dom";
import Navbar from "@/components/nav/Navbar.jsx";
import Footer from "@/components/Footer.jsx";

export default function PlainLayout() {
  return (
    <div className="min-h-[100svh] flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
