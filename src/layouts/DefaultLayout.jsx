// src/layouts/DefaultLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/Footer";

export default function DefaultLayout() {
  return (
    <div className="min-h-[100svh] flex flex-col bg-site-gradient">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
