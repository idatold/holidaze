import { useState } from "react";
import Modal from "@/components/ui/Modal";
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
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.06 4.19l3.75 3.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function ProfileMedia({ user, onUpdated, children }) {
  const [coverOpen, setCoverOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [savingCover, setSavingCover] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [coverErr, setCoverErr] = useState("");
  const [avatarErr, setAvatarErr] = useState("");

  const coverSrc = hiDpi(user.coverUrl, 1600);
  const coverSrcSet = buildSrcSet(user.coverUrl, [800, 1600, 2400]);
  const coverSizes = "(min-width: 768px) 768px, 100vw";

  function openCover() { setCoverUrlInput(user.coverUrl || ""); setCoverErr(""); setCoverOpen(true); }
  function openAvatar() { setAvatarUrlInput(user.avatarUrl || ""); setAvatarErr(""); setAvatarOpen(true); }

  async function saveCover() {
    const name = localStorage.getItem(PROFILE_NAME_KEY) || user.name;
    const raw = (coverUrlInput || "").trim();
    if (!raw) { setCoverOpen(false); return; }
    if (!/^https?:\/\//i.test(raw)) { setCoverErr("Enter a valid URL starting with http:// or https://"); return; }

    setSavingCover(true);
    try {
      await updateProfileMedia(name, { coverUrl: raw, coverAlt: `Cover for ${name}` });
      const p = await getMyProfile(name, { bookings: true, venues: true });
      const url = p?.banner?.url || raw;
      localStorage.setItem(COVER_KEY, url);
      onUpdated?.({
        name: p?.name, email: p?.email, venueManager: !!p?.venueManager,
        avatarUrl: p?.avatar?.url || user.avatarUrl, coverUrl: url,
        bio: p?.bio, created: p?.created, _count: p?._count,
      });
      window.dispatchEvent(new Event("holidaze:profile-updated"));
      setCoverOpen(false);
    } catch (e) {
      setCoverErr(e?.message || "Could not update header");
    } finally {
      setSavingCover(false);
    }
  }

  async function saveAvatar() {
    const name = localStorage.getItem(PROFILE_NAME_KEY) || user.name;
    const raw = (avatarUrlInput || "").trim();
    if (!raw) { setAvatarOpen(false); return; }
    if (!/^https?:\/\//i.test(raw)) { setAvatarErr("Enter a valid URL starting with http:// or https://"); return; }

    setSavingAvatar(true);
    try {
      await updateProfileMedia(name, { avatarUrl: raw, avatarAlt: `Avatar for ${name}` });
      const p = await getMyProfile(name, { bookings: true, venues: true });
      const url = p?.avatar?.url || raw;
      localStorage.setItem(AVATAR_KEY, url);
      onUpdated?.({
        name: p?.name, email: p?.email, venueManager: !!p?.venueManager,
        avatarUrl: url, coverUrl: p?.banner?.url || user.coverUrl,
        bio: p?.bio, created: p?.created, _count: p?._count,
      });
      window.dispatchEvent(new Event("holidaze:profile-updated"));
      setAvatarOpen(false);
    } catch (e) {
      setAvatarErr(e?.message || "Could not update photo");
    } finally {
      setSavingAvatar(false);
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
          <div className="flex h-full w-full items-center justify-center text-ocean/60">Add a header photo</div>
        )}

        <button onClick={openCover} className="btn-chip btn-chip-pink absolute right-3 top-3">
          <PencilIcon className="h-4 w-4" />
          Edit header
        </button>
      </div>

      {/* Avatar + stack */}
      <div className="px-6 pb-6 pt-0">
        <div className="relative -mt-10 flex flex-col items-center">
          <div className="relative h-24 w-24 rounded-full border-4 border-white bg-sand shadow">
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

      {/* COVER MODAL */}
      <Modal
        open={coverOpen}
        onClose={() => { if (!savingCover) setCoverOpen(false); }}
        title="Edit header photo"
        className="ring-2 ring-pink-500"
      >
        <div className="space-y-4">
          <div className="relative aspect-[16/6] w-full overflow-hidden rounded border-4 border-ocean-500 bg-white shadow-sm">
            {coverUrlInput ? (
              <img src={hiDpi(coverUrlInput, 1600)} alt="Cover preview" className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ocean/60">Preview</div>
            )}
          </div>

          <input
            type="url"
            value={coverUrlInput}
            onChange={(e) => { setCoverUrlInput(e.target.value); if (coverErr) setCoverErr(""); }}
            placeholder="https://images.unsplash.com/...&w=1600"
            className="w-full rounded-[5px] border border-pink-500 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {coverErr && (
            <div className="flex items-center gap-2 rounded-[5px] border border-pink-500 bg-pink-500/10 px-3 py-2 text-pink-700">
              <span className="text-lg">⦿</span>
              <span className="text-sm">{coverErr}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-1">
            <button className="btn btn-outline-pink w-full uppercase" onClick={() => setCoverOpen(false)} disabled={savingCover}>
              Cancel
            </button>
            <button className="btn btn-pink w-full uppercase shadow disabled:opacity-60" onClick={saveCover} disabled={savingCover}>
              {savingCover ? "Saving…" : "Update header"}
            </button>
          </div>
        </div>
      </Modal>

      {/* AVATAR MODAL */}
      <Modal
        open={avatarOpen}
        onClose={() => { if (!savingAvatar) setAvatarOpen(false); }}
        title="Edit profile picture"
        className="ring-2 ring-pink-500"
      >
        <div className="space-y-4">
          <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-ocean-500 bg-ocean-500 shadow-sm">
            {avatarUrlInput ? (
              <img src={hiDpi(avatarUrlInput, 256)} alt="Avatar preview" className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/90">Preview</div>
            )}
          </div>

          <input
            type="url"
            value={avatarUrlInput}
            onChange={(e) => { setAvatarUrlInput(e.target.value); if (avatarErr) setAvatarErr(""); }}
            placeholder="https://images.unsplash.com/...&w=256"
            className="w-full rounded-[5px] border border-pink-500 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {avatarErr && (
            <div className="flex items-center gap-2 rounded-[5px] border border-pink-500 bg-pink-500/10 px-3 py-2 text-pink-700">
              <span className="text-lg">⦿</span>
              <span className="text-sm">{avatarErr}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-1">
            <button className="btn btn-outline-pink w-full uppercase" onClick={() => setAvatarOpen(false)} disabled={savingAvatar}>
              Cancel
            </button>
            <button className="btn btn-pink w-full uppercase shadow disabled:opacity-60" onClick={saveAvatar} disabled={savingAvatar}>
              {savingAvatar ? "Saving…" : "Update photo"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
