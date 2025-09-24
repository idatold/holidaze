// src/components/ui/CardCarouselOne.jsx
import { useEffect, useState } from "react";

/**
 * One-up card carousel (shows exactly 1 card at a time).
 * Props:
 *  - items: array with unique "id"
 *  - renderItem: (item) => JSX
 *  - viewportWidths: tailwind width classes (default matches your profile carousels)
 */
export default function CardCarouselOne({
  items = [],
  renderItem,
  viewportWidths = "w-[240px] sm:w-[260px] md:w-[280px]",
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex((i) => (items.length ? Math.min(i, items.length - 1) : 0));
  }, [items.length]);

  if (!items.length) return null;

  const prev = () => setIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  return (
    <div className="mt-2 flex flex-col items-center">
      <div className="relative inline-block">
        {/* viewport shows exactly ONE card */}
        <div className={`overflow-hidden ${viewportWidths}`}>
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map((it) => (
              <div key={it.id} className="w-full shrink-0">
                {renderItem(it)}
              </div>
            ))}
          </div>
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={prev}
              className="
                absolute -left-12 sm:-left-16 top-1/2 -translate-y-1/2
                h-14 w-14 sm:h-16 sm:w-16
                flex items-center justify-center
                text-ocean hover:scale-105 active:scale-95 focus:outline-none
              "
            >
              <span className="block text-5xl sm:text-6xl leading-none -mt-2 select-none">
                ‹
              </span>
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={next}
              className="
                absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2
                h-14 w-14 sm:h-16 sm:w-16
                flex items-center justify-center
                text-ocean hover:scale-105 active:scale-95 focus:outline-none
              "
            >
              <span className="block text-5xl sm:text-6xl leading-none -mt-2 select-none">
                ›
              </span>
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="mt-3 mb-2 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={[
                "h-2.5 w-2.5 rounded-full transition",
                i === index ? "bg-ocean" : "bg-zinc-300",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
