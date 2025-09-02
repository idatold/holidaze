import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      {/* Background image */}
      <img
        src="/assets/landing-hero.jpg"  /* use your sea photo */
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
        draggable="false"
      />

      {/* Soft darkening for contrast */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Centered content */}
      <section className="relative z-10 grid min-h-[100svh] place-items-center px-4">
        <div className="text-center text-white max-w-2xl">
          {/* Logo */}
          <img
            src="/assets/logo.svg"
            alt="Holidaze"
            className="mx-auto mb-4 h-16 sm:h-20 select-none"
            draggable="false"
          />

          {/* Tagline */}
          <p className="mx-auto max-w-xl text-base sm:text-lg font-medium">
            Host or Discover — Your Next Experience Starts Here.
          </p>

          {/* CTA + secondary link */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link to="/venues" className="btn-ocean w-44">
              SEE VENUES
            </Link>
            <Link to="/login" className="link-light">
              LOG IN
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
