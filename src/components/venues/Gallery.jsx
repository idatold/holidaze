// src/components/venues/Gallery.jsx
import { useEffect, useState, useCallback } from "react";

/**
 * Gallery
 * - images: Array<{ url: string, alt?: string }>
 * - title: string (fallback alt text)
 * - locLabel?: string  -> e.g. "Bodø, Norway"
 * - locIconSrc?: string -> e.g. pin icon
 */
export default function Gallery({ images = [], title = "Image", locLabel, locIconSrc }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const hasImages = Array.isArray(images) && images.length > 0;

  const onKeyDown = useCallback(
    (e) => {
      if (!lightbox) return;
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setCurrent((i) => (hasImages ? (i + 1) % images.length : 0));
      if (e.key === "ArrowLeft") setCurrent((i) => (hasImages ? (i - 1 + images.length) % images.length : 0));
    },
    [lightbox, hasImages, images.length]
  );

  useEffect(() => {
    if (!lightbox) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [lightbox, onKeyDown]);

  if (!hasImages) {
    return (
      <div className="mt-6 rounded-[10px] border border-dashed border-zinc-300 p-6 text-zinc-500 text-sm">
        No images available for this venue yet.
      </div>
    );
  }

  return (
    <section aria-label="Venue gallery" className="mt-4">
      {/* Main image (16:10) */}
      <button
        type="button"
        onClick={() => setLightbox(true)}
        aria-label="Open image in full screen"
        className="group relative block w-full rounded-[12px] focus:outline-none focus-visible:border-2 focus-visible:border-[#006492]"
      >
        {/* Location badge overlay (non-interactive so click still opens lightbox) */}
        {locLabel && (
          <div className="pointer-events-none absolute top-2 left-2 z-10 rounded-[8px] bg-white/95 px-2 py-1 text-xs font-semibold flex items-center gap-1">
            {locIconSrc && <img src={locIconSrc} alt="" className="h-4 w-4 inline-block" loading="lazy" />}
            <span className="text-ink">{locLabel}</span>
          </div>
        )}

        {/* Keep overflow/crop on inner frame so borders/rings never clip */}
        <div className="aspect-[16/10] bg-zinc-100 overflow-hidden rounded-[12px]">
          <img
            src={images[current]?.url}
            alt={images[current]?.alt || title}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/0 group-hover:bg-black/10" />
      </button>

      {/* Thumbnails */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 pt-1">
        {images.map((m, i) => {
          const active = i === current;
          return (
            <button
              key={(m.url || "") + i}
              onClick={() => setCurrent(i)}
              type="button"
              aria-label={`Show image ${i + 1}`}
              aria-current={active ? "true" : undefined}
              className={[
                "relative h-16 w-24 flex-none rounded-[12px] p-[2px] transition border-2",
                "focus:outline-none",
                active ? "border-[#006492]" : "border-transparent hover:border-zinc-300/70",
                "focus-visible:border-[#006492]",
              ].join(" ")}
            >
              <span className="block h-full w-full overflow-hidden rounded-[10px]">
                <img src={m.url} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md"
          onClick={() => setLightbox(false)}
        >
          <div
            className="relative grid place-items-center w-full h-full max-h-[90vh] p-3 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image wrapper is the anchor for controls */}
            <div className="relative inline-block">
              <img
                src={images[current]?.url}
                alt={images[current]?.alt || title}
                className="h-auto w-auto max-h-[82vh] max-w-[92vw] md:max-w-[86vw] object-contain rounded-[12px] shadow-xl"
              />

              {/* Pink controls inset ~1rem; SVGs ensure perfect centering */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrent((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-[#D23393] text-white shadow-lg hover:brightness-110 active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    aria-label="Previous image"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrent((i) => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-[#D23393] text-white shadow-lg hover:brightness-110 active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    aria-label="Next image"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}

              {/* Close button: same size as arrows, top-right inside by 1rem */}
              <button
                onClick={() => setLightbox(false)}
                className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-[#D23393] text-white shadow-lg hover:brightness-110 active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 6l12 12M6 18L18 6" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Counter below image, centered */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-ink text-xs shadow">
              {current + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
