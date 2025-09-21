// src/components/ui/BrandStars.jsx
import { useId } from "react";

/**
 * Rounded, consistent stars:
 * - Same path & same stroke for all states (round joins).
 * - HALF uses a single L→R gradient for BOTH fill and stroke (no seam).
 * - Tweak STROKE_W for roundness (2.4–2.8 sweet spot).
 */
export default function BrandStars({
  rating = 0,
  size = "h-6 w-6 sm:h-7 sm:w-7",
  className = "",
}) {
  const uid = useId();
  const r = Math.max(0, Math.min(5, Math.round(rating * 2) / 2));
  const full = Math.floor(r);
  const hasHalf = r - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  const states = [
    ...Array(full).fill("full"),
    ...(hasHalf ? ["half"] : []),
    ...Array(empty).fill("empty"),
  ];

  return (
    <div
      className={`inline-flex items-center gap-1 leading-none ${className}`}
      aria-label={`Rating ${r} out of 5`}
    >
      {states.map((state, i) => (
        <RoundedStar
          key={i}
          state={state}
          className={size}
          idPrefix={`${uid}-star-${i}`}
        />
      ))}
    </div>
  );
}

function RoundedStar({
  state = "empty",
  className = "h-6 w-6 sm:h-7 sm:w-7",
  idPrefix,
}) {
  // same rounded star path as before
  const d =
    "M12 2.7c.28 0 .54.16.67.42l1.77 3.58c.12.25.35.42.62.46l3.98.58c.73.11 1.02 1.01.49 1.51l-2.88 2.81c-.2.19-.29.47-.24.74l.68 3.95c.13.75-.65 1.33-1.3.98l-3.55-1.86a.86.86 0 0 0-.78 0l-3.55 1.86c-.65.34-1.43-.23-1.3-.98l.68-3.95c.05-.27-.04-.55-.24-.74L4.5 8.75c-.53-.51-.24-1.41.49-1.51l3.98-.58c.27-.04.51-.21.62-.46l1.77-3.58c.13-.26.39-.42.67-.42z";

  const PINK = "#D23393";
  const GRAY = "#E5E7EB";
  const STROKE_W = 2.6; // ↑ rounder, ↓ sharper
  const transform = "translate(-0.6 -0.6) scale(1.06)";

  const gradId = `${idPrefix}-grad`;

  return (
    <svg
      viewBox="0 0 24 24"
      className={`block shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {state === "half" && (
        <defs>
          {/* 50/50 hard split. default gradientUnits=objectBoundingBox (0..1) */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={PINK} />
            <stop offset="50%" stopColor={PINK} />
            <stop offset="50%" stopColor={GRAY} />
            <stop offset="100%" stopColor={GRAY} />
          </linearGradient>
        </defs>
      )}

      <g transform={transform}>
        {/* FILL */}
        <path
          d={d}
          fill={
            state === "full"
              ? PINK
              : state === "half"
              ? `url(#${gradId})`
              : GRAY
          }
        />
        {/* STROKE — same for all states; half uses the SAME gradient so no seam */}
        <path
          d={d}
          fill="none"
          stroke={
            state === "full"
              ? PINK
              : state === "half"
              ? `url(#${gradId})`
              : GRAY
          }
          strokeWidth={STROKE_W}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
