import { useState } from "react";
import EditImageModal from "./EditImageModal";
import toast from "@/lib/toast";
import { getMyProfile, updateProfileMedia } from "@/lib/authApi";
import { AVATAR_KEY, COVER_KEY, PROFILE_NAME_KEY } from "@/lib/auth";

const USE_HIDPI = true;

function hiDpi(url, w = 1600) {
  if (!url) return url;
  if (!USE_HIDPI) return url;
  try {
    const u = new URL(url);
    const dpr = window.devicePixelRatio > 1 ? 2 : 1;
    if (u.hostname.includes("images.unsplash.com")) {
      u.searchParams.set("auto", "format");
      u.searchParams.set("fit", "crop");
      u.searchParams.set("w", String(w));
      u.searchParams.set("q", "80");
      u.searchParams.set("dpr", String(dpr));
      return u.toString();
    }
    if (u.hostname.includes("imgix") || u.hostname.includes("cloudinary")) {
      u.searchParams.set("w", String(w));
      u.searchParams.set("dpr", String(dpr));
      return u.toString();
    }
    return url;
  } catch {
    return url;
  }
}
function buildSrcSet(url, widths = []) {
  if (!url) return undefined;
  return widths.map((w) => `${hiDpi(url, w)} ${w}w`).join(", ");
}

function PencilIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14.06 4.19l3.75 3.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function ProfileMedia({ user, onUpdated, children }) {
  const [coverOpen, setCoverOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const coverSrc = hiDpi(user.coverUrl, 1600);
  const coverSrcSet = buildSrcSet(user.coverUrl, [800, 1600, 2400]);
  const coverSizes = "(min-width: 768px) 768px, 100vw";

  function openCover() {
    setCoverOpen(true);
  }
  function openAvatar() {
    setAvatarOpen(true);
  }

  async function handleSaveCover(rawUrl) {
    const name = localStorage.getItem(PROFILE_NAME_KEY) || user.name;
    try {
      await updateProfileMedia(name, {
        coverUrl: rawUrl,
        coverAlt: `Cover for ${name}`,
      });
      const p = await getMyProfile(name, { bookings: true, venues: true });
      const url = p?.banner?.url || rawUrl;
      localStorage.setItem(COVER_KEY, url);
      onUpdated?.({
        name: p?.name,
        email: p?.email,
        venueManager: !!p?.venueManager,
        avatarUrl: p?.avatar?.url || user.avatarUrl,
        coverUrl: url,
        bio: p?.bio,
        created: p?.created,
        _count: p?._count,
      });
      window.dispatchEvent(new Event("holidaze:profile-updated"));
      toast.miniSuccess("Banner updated");
      setCoverOpen(false);
    } catch (e) {
      toast.error(e?.message || "Could not update header");
    }
  }

  async function handleSaveAvatar(rawUrl) {
    const name = localStorage.getItem(PROFILE_NAME_KEY) || user.name;
    try {
      await updateProfileMedia(name, {
        avatarUrl: rawUrl,
        avatarAlt: `Avatar for ${name}`,
      });
      const p = await getMyProfile(name, { bookings: true, venues: true });
      const url = p?.avatar?.url || rawUrl;
      localStorage.setItem(AVATAR_KEY, url);
      onUpdated?.({
        name: p?.name,
        email: p?.email,
        venueManager: !!p?.venueManager,
        avatarUrl: url,
        coverUrl: p?.banner?.url || user.coverUrl,
        bio: p?.bio,
        created: p?.created,
        _count: p?._count,
      });
      window.dispatchEvent(new Event("holidaze:profile-updated"));
      toast.miniSuccess("Avatar updated");
      setAvatarOpen(false);
    } catch (e) {
      toast.error(e?.message || "Could not update photo");
    }
  }

  return (
    <>
      {/* Cover */}
      <div className="relative h-44 w-full bg-foam md:h-56">
        {user.coverUrl ? (
          <img
            src={coverSrc}
            srcSet={coverSrcSet}
            sizes={coverSizes}
            alt="Profile header"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ocean/60">
            Add a header photo
          </div>
        )}

        <button
          onClick={openCover}
          className="btn-chip btn-chip-pink absolute right-3 top-3"
        >
          <PencilIcon className="h-4 w-4" />
          Edit header
        </button>
      </div>

      {/* Avatar + stack */}
      <div className="px-6 pb-6 pt-0">
        <div className="relative -mt-10 flex flex-col items-center">
          <div className="relative h-30 w-30 rounded-full bg-ocean shadow">
            {user.avatarUrl ? (
              <img
                src={hiDpi(user.avatarUrl, 256)}
                alt={`${user.name} avatar`}
                className="h-full w-full rounded-full object-cover"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-ocean">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}

            <button
              onClick={openAvatar}
              aria-label="Edit profile picture"
              className="btn-icon btn-icon-pink absolute -bottom-1 -right-1"
            >
              <PencilIcon />
            </button>
          </div>

          {children}
        </div>
      </div>

      {/* REUSABLE MODALS */}
      <EditImageModal
        open={coverOpen}
        onClose={() => setCoverOpen(false)}
        mode="cover"
        initialUrl={user.coverUrl || ""}
        onSave={handleSaveCover}
      />

      <EditImageModal
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        mode="avatar"
        initialUrl={user.avatarUrl || ""}
        onSave={handleSaveAvatar}
      />
    </>
  );
}
