import { Outlet } from "react-router-dom";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/Footer";

export default function DefaultLayout() {
  return (
    <div className="min-h-[100svh] flex flex-col bg-site-gradient">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
