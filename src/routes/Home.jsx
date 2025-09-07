import { Link } from "react-router-dom";
import logo from "../assets/holidazewhitelogo.svg";
import heroMp4 from "../assets/hero-1080p.mp4";
import heroPoster from "../assets/landing-hero.jpg"; // ← fallback image

export default function Home() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      {/* Mobile fallback image */}
      <img
        src={heroPoster}
        alt="ocean waves moving onto land from above"
        className="absolute inset-0 h-full w-full object-cover sm:hidden"
        aria-hidden="true"
        draggable="false"
      />

      {/* Background video (≥640px) */}
      <video
        className="absolute inset-0 hidden h-full w-full object-cover sm:block"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={heroPoster}
        aria-hidden="true"
      >
        <source src={heroMp4} type="video/mp4" />
      </video>

      {/* Soft darkening for contrast */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Centered content */}
      <section className="relative z-10 grid min-h-[100svh] place-items-center px-4">
        <div className="text-center text-white max-w-2xl text-shadow">
          {/* Logo */}
          <img
            src={logo}
            alt="Holidaze"
            className="mx-auto mb-4 w-[378px] h-[174px] select-none"
          />

          {/* Tagline — Arsenal Bold 32px */}
          <p className="mx-auto max-w-xl font-arsenal font-bold text-[20px]">
            Host or Discover — Your Next Experience Starts Here.
          </p>

          {/* CTA + secondary link */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link
              to="/venues"
              className="btn btn-ocean w-[180px] h-[50px] font-arsenal font-bold text-[16px] text-shadow shadow-lg"
            >
              SEE VENUES
            </Link>

            <Link
              to="/login"
              className="text-white text-[16px] font-arsenal font-bold uppercase tracking-wide hover:underline underline-offset-4 text-shadow"
            >
              LOG IN
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
