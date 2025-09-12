import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "@/components/ui/Modal";

import {
  AVATAR_KEY,
  COVER_KEY,
  PROFILE_NAME_KEY,
  PROFILE_EMAIL_KEY,
} from "@/lib/auth";

import { getMyProfile, updateProfileMedia } from "@/lib/authApi";

/* inline pencil icon */
function PencilIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.06 4.19l3.75 3.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Profile() {
  const [user, setUser] = useState({
    name: "sunGypsy",
    email: "you@example.com",
    venueManager: true,
    avatarUrl: "",
    coverUrl: "",
  });

  useEffect(() => {
    // 1) hydrate from localStorage
    const name = localStorage.getItem(PROFILE_NAME_KEY);
    const email = localStorage.getItem(PROFILE_EMAIL_KEY);
    const avatarUrl = localStorage.getItem(AVATAR_KEY);
    const coverUrl = localStorage.getItem(COVER_KEY);

    setUser((u) => ({
      ...u,
      name: name || u.name,
      email: email || u.email,
      avatarUrl: avatarUrl || u.avatarUrl,
      coverUrl: coverUrl || u.coverUrl,
    }));

    // 2) fetch fresh from API
    if (name) {
      getMyProfile(name, { bookings: true, venues: true })
        .then((p) => {
          setUser((u) => ({
            ...u,
            name: p?.name || u.name,
            email: p?.email || u.email,
            venueManager: Boolean(p?.venueManager),
            avatarUrl: p?.avatar?.url || u.avatarUrl,
            coverUrl: p?.banner?.url || u.coverUrl,
          }));
          if (p?.avatar?.url) localStorage.setItem(AVATAR_KEY, p.avatar.url);
          if (p?.banner?.url) localStorage.setItem(COVER_KEY, p.banner.url);
        })
        .catch(() => {});
    }
  }, []);

  // modals
  const [coverOpen, setCoverOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [savingCover, setSavingCover] = useState(false);
const [savingAvatar, setSavingAvatar] = useState(false);


  // inputs + errors
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [coverErr, setCoverErr] = useState("");
  const [avatarErr, setAvatarErr] = useState("");

  function openCover() {
    setCoverUrlInput(user.coverUrl || "");
    setCoverErr("");
    setCoverOpen(true);
  }
  function openAvatar() {
    setAvatarUrlInput(user.avatarUrl || "");
    setAvatarErr("");
    setAvatarOpen(true);
  }

  async function saveCover() {
  const name = localStorage.getItem(PROFILE_NAME_KEY);
  const raw = (coverUrlInput || "").trim();

  if (!raw) { setCoverOpen(false); return; }
  if (!/^https?:\/\//i.test(raw)) {
    setCoverErr("Enter a valid URL starting with http:// or https://");
    return;
  }

  setSavingCover(true);
  try {
    let url = raw;

    // Persist to API if logged in (we know profile name)
    if (name) {
      const p = await updateProfileMedia(name, { coverUrl: raw });
      url = p?.banner?.url || raw; // fallback to what user typed
    }

    // Cache + update UI
    localStorage.setItem(COVER_KEY, url);
    setUser((u) => ({ ...u, coverUrl: url }));
    window.dispatchEvent(new Event("holidaze:profile-updated"));
    setCoverOpen(false);
  } catch (e) {
    setCoverErr(e?.response?.data?.message || e.message || "Could not update header");
  } finally {
    setSavingCover(false);
  }
}

async function saveAvatar() {
  const name = localStorage.getItem(PROFILE_NAME_KEY);
  const raw = (avatarUrlInput || "").trim();

  if (!raw) { setAvatarOpen(false); return; }
  if (!/^https?:\/\//i.test(raw)) {
    setAvatarErr("Enter a valid URL starting with http:// or https://");
    return;
  }

  setSavingAvatar(true);
  try {
    let url = raw;

    if (name) {
      const p = await updateProfileMedia(name, { avatarUrl: raw });
      url = p?.avatar?.url || raw;
    }

    localStorage.setItem(AVATAR_KEY, url);
    setUser((u) => ({ ...u, avatarUrl: url }));
    window.dispatchEvent(new Event("holidaze:profile-updated"));
    setAvatarOpen(false);
  } catch (e) {
    setAvatarErr(e?.response?.data?.message || e.message || "Could not update photo");
  } finally {
    setSavingAvatar(false);
  }
}


  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Profile card */}
      <div className="card-sand p-0 overflow-hidden">
        {/* Cover */}
        <div className="relative h-44 w-full bg-[#E6F2FA] md:h-56">
          {user.coverUrl ? (
            <img
              src={user.coverUrl}
              alt="Profile header"
              className="h-full w-full object-cover"
              draggable="false"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ocean/60">
              Add a header photo
            </div>
          )}

          <button
            onClick={openCover}
            className="absolute right-3 top-3 inline-flex items-center gap-2 rounded bg-white/95 px-3 py-1 text-sm text-[#D23393] shadow ring-1 ring-[#D23393] hover:bg-white"
          >
            <PencilIcon className="h-4 w-4" />
            Edit header
          </button>
        </div>

        {/* Avatar row + name + toggle */}
        <div className="px-6 pb-6 pt-0">
          <div className="relative -mt-10 flex flex-col items-center">
            <div className="relative h-24 w-24 rounded-full border-4 border-white bg-[#E7EEF6] shadow">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`${user.name} avatar`}
                  className="h-full w-full rounded-full object-cover"
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
                className="absolute -bottom-1 -right-1 rounded-full bg-white p-2 text-[#D23393] shadow ring-1 ring-[#D23393] hover:bg-[#FFF2F8]"
              >
                <PencilIcon />
              </button>
            </div>

            <div className="mt-3 text-center">
              <h1 className="font-higuen text-ocean text-2xl">{user.name}</h1>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-ocean">Venue manager</span>
              <button
                type="button"
                role="switch"
                aria-checked={user.venueManager}
                onClick={() =>
                  setUser((u) => ({ ...u, venueManager: !u.venueManager }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition
                  ${user.venueManager ? "bg-ocean-deep" : "bg-ocean"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition
                    ${user.venueManager ? "translate-x-5" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 space-y-6">
            <section>
              <h2 className="mb-2 text-center font-higuen text-ocean text-xl">
                My bookings
              </h2>
              <EmptyState
                text="No bookings yet."
                cta={<Link to="/venues" className="underline text-ocean">Browse venues</Link>}
              />
            </section>

            <section>
              <h2 className="mb-2 text-center font-higuen text-ocean text-xl">
                My venues
              </h2>
              {user.venueManager ? (
                <EmptyState
                  text="You haven’t created any venues yet."
                  cta={<Link to="/venues/create" className="btn btn-pink mt-2">Create venue</Link>}
                />
              ) : (
                <p className="text-center text-sm text-ocean/80">
                  Enable “Venue manager” to list your spaces.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>

      <Modal
  open={coverOpen}
  onClose={() => setCoverOpen(false)}
  title="Edit header photo"
  className="ring-2 ring-[#D23393]"
>
  <div className="space-y-4">
    <div className="relative aspect-[16/6] w-full overflow-hidden rounded border-4 border-[#006492] bg-white shadow-sm">
      {coverUrlInput ? (
        <img src={coverUrlInput} alt="Cover preview" className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-ocean/60">
          Preview
        </div>
      )}
    </div>

    <input
      type="url"
      value={coverUrlInput}
      onChange={(e) => { setCoverUrlInput(e.target.value); if (coverErr) setCoverErr(""); }}
      placeholder="https://example.com/cover-image.jpg"
      className="w-full rounded-[5px] border border-[#D23393]/40 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D23393]"
    />

    {coverErr && (
      <div className="flex items-center gap-2 rounded-[5px] border border-[#D23393] bg-[#D23393]/10 px-3 py-2 text-[#8A114E]">
        <span className="text-lg">⦿</span>
        <span className="text-sm">{coverErr}</span>
      </div>
    )}

    {/* ⬇️ BUTTONS are here */}
    <div className="grid grid-cols-2 gap-4 pt-1">
      <button
        className="btn w-full uppercase shadow border-2 border-[#D23393] text-[#D23393] hover:bg-[#FFF2F8] disabled:opacity-60"
        onClick={() => setCoverOpen(false)}
        disabled={savingCover}
      >
        Cancel
      </button>
      <button
        className="btn btn-pink w-full uppercase shadow disabled:opacity-60"
        onClick={saveCover}
        disabled={savingCover}
      >
        {savingCover ? "Saving…" : "Update header"}
      </button>
    </div>
  </div>
</Modal>

     <Modal
  open={avatarOpen}
  onClose={() => setAvatarOpen(false)}
  title="Edit profile picture"
  className="ring-2 ring-[#D23393]"
>
  <div className="space-y-4">
    <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-[#006492] bg-[#006492] shadow-sm">
      {avatarUrlInput ? (
        <img src={avatarUrlInput} alt="Avatar preview" className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/90">
          Preview
        </div>
      )}
    </div>

    <input
      type="url"
      value={avatarUrlInput}
      onChange={(e) => { setAvatarUrlInput(e.target.value); if (avatarErr) setAvatarErr(""); }}
      placeholder="https://example.com/avatar.jpg"
      className="w-full rounded-[5px] border border-[#D23393]/40 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D23393]"
    />

    {avatarErr && (
      <div className="flex items-center gap-2 rounded-[5px] border border-[#D23393] bg-[#D23393]/10 px-3 py-2 text-[#8A114E]">
        <span className="text-lg">⦿</span>
        <span className="text-sm">{avatarErr}</span>
      </div>
    )}

    {/* ⬇️ BUTTONS are here */}
    <div className="grid grid-cols-2 gap-4 pt-1">
      <button
        className="btn w-full uppercase shadow border-2 border-[#D23393] text-[#D23393] hover:bg-[#FFF2F8] disabled:opacity-60"
        onClick={() => setAvatarOpen(false)}
        disabled={savingAvatar}
      >
        Cancel
      </button>
      <button
        className="btn btn-pink w-full uppercase shadow disabled:opacity-60"
        onClick={saveAvatar}
        disabled={savingAvatar}
      >
        {savingAvatar ? "Saving…" : "Update photo"}
      </button>
    </div>
  </div>
</Modal>

    </div>
  );
}

function EmptyState({ text, cta }) {
  return (
    <div className="rounded-[5px] border border-dashed border-[#006492]/30 p-4 text-center text-sm text-ocean/80">
      <p>{text}</p>
      {cta && <div className="mt-2">{cta}</div>}
    </div>
  );
}
