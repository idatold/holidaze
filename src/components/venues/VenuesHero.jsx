import { useState } from "react";
import heroDesktop from "@/assets/venues-hero-desktop.jpg";
import heroMobile from "@/assets/venues-hero-mobile.jpg";
import BrandDatePicker from "@/components/ui/BrandDatePicker.jsx";

export default function VenuesHero({
  q,
  onQChange,
  onSubmit,
  fullBleed = false,
}) {
  // brand date state
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  // Full-bleed width like your navbar, but we won't use overflow on the wrapper
  const bleed = fullBleed
    ? "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen"
    : "";

  return (
    // NOTE: no overflow-hidden here to avoid clipping anything
    <section className={`${bleed} mt-0 mb-6 sm:mb-8`}>
      <div className="relative w-full h-[440px] sm:h-[360px] lg:h-[520px]">
        {/* Only the media layer is clipped, not the whole section */}
        <div className="absolute inset-0 overflow-hidden">
          <picture className="absolute inset-0">
            <source media="(min-width: 1024px)" srcSet={heroDesktop} />
            <img
              src={heroMobile}
              alt="Venues header"
              className="h-full w-full object-cover object-center"
              draggable="false"
              onError={(e) => (e.currentTarget.style.opacity = 0)}
            />
          </picture>
          <div className="absolute inset-0 bg-black/35" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white gap-4 px-4">
          <h1 className="text-3xl sm:text-4xl font-bold drop-shadow">Venues</h1>
          <p className="font-bold">Find venues posted by our community</p>

          {/* Form: Arsenal font, 5px radius, brand pink inputs, no rings */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // pass dates up if the parent wants them
              onSubmit?.(e, { dateFrom, dateTo });
            }}
            className="font-arsenal mt-1 flex flex-col sm:flex-row gap-2 bg-white/95 backdrop-blur rounded-[5px] p-2 sm:p-3 shadow"
          >
            <input
              value={q}
              onChange={(e) => onQChange(e.target.value)}
              placeholder="Search venues…"
              className="input-hero control-12 w-72 sm:w-80"
            />

            {/* Brand date pickers */}
            <BrandDatePicker
              label="From"
              selected={dateFrom}
              onChange={setDateFrom}
              placeholder="dd/mm/yyyy"
            />
            <BrandDatePicker
              label="To"
              selected={dateTo}
              onChange={setDateTo}
              placeholder="dd/mm/yyyy"
            />

            <button type="submit" className="btn btn-pink h-12 py-0 px-6">
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
