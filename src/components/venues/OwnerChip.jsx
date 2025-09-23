import { Link } from "react-router-dom";

export default function OwnerChip({
  owner,
  className = "",
  label = "Hosted by",
  linkBase = "/profile",
}) {
  if (!owner) return null;

  const name = (owner?.name || "Owner").trim();

  // Support either string or object for avatar
  const avatarUrl =
    typeof owner?.avatar === "string" ? owner.avatar : owner?.avatar?.url || "";
  const avatarAlt =
    (typeof owner?.avatar === "object" && owner?.avatar?.alt) ||
    `${name} avatar`;

  // Build link defensively: trim trailing slashes from base, URI-encode name.
  // If linkBase is falsy (""/null/undefined), we render a non-clickable chip.
  const base = String(linkBase || "").replace(/\/+$/, "");
  const to = name && base ? `${base}/${encodeURIComponent(name)}` : undefined;

  const ChipInner = (
    <>
      <Avatar src={avatarUrl} alt={avatarAlt} />
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[#D23393]">{name}</span>
        {owner?.venueManager && <VerifiedBadge />}
      </div>
    </>
  );

  return (
    <div className={`mt-4 ${className}`}>
      {/* Label above chip */}
      <div className="mb-2 text-ocean font-bold text-sm">{label}</div>

      {to ? (
        <Link
          to={to}
          className="inline-flex items-center gap-3 rounded-[5px] bg-white/95 px-3 py-2 shadow ring-1 ring-zinc-200 transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006492]/50"
          aria-label={`View ${name}'s profile`}
        >
          {ChipInner}
        </Link>
      ) : (
        <div className="inline-flex items-center gap-3 rounded-[5px] bg-white/95 px-3 py-2 shadow ring-1 ring-zinc-200">
          {ChipInner}
        </div>
      )}
    </div>
  );
}

function Avatar({ src, alt }) {
  const size = "h-8 w-8 sm:h-9 sm:w-9";
  if (src) {
    return (
      // eslint-disable-next-line jsx-a11y/img-redundant-alt
      <img
        src={src}
        alt={alt}
        className={`${size} rounded-full object-cover ring-1 ring-zinc-200`}
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    );
  }
  const initial = (alt || "?").trim().charAt(0).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`${size} grid place-items-center rounded-full bg-[#FAF6F4] text-[#D23393] font-bold ring-1 ring-zinc-200`}
    >
      {initial}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span
      title="Venue manager"
      className="inline-flex items-center gap-1 rounded-[5px] bg-white text-[#006492] text-[11px] font-semibold px-1.5 py-0.5 ring-1 ring-[#006492]/30"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          d="M12 3l7 3v6c0 3.87-2.69 7.19-7 8-4.31-.81-7-4.13-7-8V6l7-3z"
          fill="currentColor"
          opacity="0.18"
        />
        <path
          d="M12 4.5l5.5 2.3v4.7c0 3.1-2.17 5.75-5.5 6.4-3.33-.65-5.5-3.3-5.5-6.4V6.8L12 4.5z"
          fill="currentColor"
          opacity="0.25"
        />
        <path
          d="M9.2 12.2l1.9 1.9 3.7-3.7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">Venue manager</span>
      <span aria-hidden="true">Venue manager</span>
    </span>
  );
}
