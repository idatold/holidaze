import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "@/components/ui/Modal";

// localStorage keys (so Navbar can read later)
const AVATAR_KEY = "holidaze_avatar_url";
const COVER_KEY = "holidaze_cover_url";
const PINK = "#D23393";

export default function Profile() {
  const [user, setUser] = useState({
    name: "sunGypsy",
    email: "you@example.com",
    venueManager: true,
    avatarUrl: "",
    coverUrl: "",
  });

  // Load persisted images (pretend API data)
  useEffect(() => {
    setUser((u) => ({
      ...u,
      avatarUrl: localStorage.getItem(AVATAR_KEY) || u.avatarUrl,
      coverUrl: localStorage.getItem(COVER_KEY) || u.coverUrl,
    }));
  }, []);

  // Modals state
  const [coverOpen, setCoverOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  // URL inputs + validation errors
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [coverErr, setCoverErr] = useState("");
  const [avatarErr, setAvatarErr] = useState("");

  function isValidUrl(str) {
    try {
      const u = new URL(str);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  // open modals with current values
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

  // Save handlers (URL only)
  function saveCover() {
    if (!coverUrlInput || !isValidUrl(coverUrlInput)) {
      setCoverErr("Image url is required");
      return;
    }
    localStorage.setItem(COVER_KEY, coverUrlInput);
    setUser((u) => ({ ...u, coverUrl: coverUrlInput }));
    setCoverOpen(false);
  }

  function saveAvatar() {
    if (!avatarUrlInput || !isValidUrl(avatarUrlInput)) {
      setAvatarErr("Image url is required");
      return;
    }
    localStorage.setItem(AVATAR_KEY, avatarUrlInput);
    setUser((u) => ({ ...u, avatarUrl: avatarUrlInput }));
    setAvatarOpen(false);
    // Later: also update global user context so Navbar shows it immediately.
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

          {/* Edit cover button (pen) */}
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
          {/* Avatar - overlaps the cover */}
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

              {/* Edit avatar button (pen) */}
              <button
                onClick={openAvatar}
                aria-label="Edit profile picture"
                className="absolute -bottom-1 -right-1 rounded-full bg-white p-2 text-[#D23393] shadow ring-1 ring-[#D23393] hover:bg-[#FFF2F8]"
              >
                <PencilIcon />
              </button>
            </div>

            {/* Name */}
            <div className="mt-3 text-center">
              <h1 className="font-higuen text-ocean text-2xl">{user.name}</h1>
            </div>

            {/* Venue manager toggle */}
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
                cta={
                  <Link to="/venues" className="underline text-ocean">
                    Browse venues
                  </Link>
                }
              />
            </section>

            <section>
              <h2 className="mb-2 text-center font-higuen text-ocean text-xl">
                My venues
              </h2>
              {user.venueManager ? (
                <EmptyState
                  text="You haven’t created any venues yet."
                  cta={
                    <Link to="/venues/create" className="btn btn-pink mt-2">
                      Create venue
                    </Link>
                  }
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

{/* COVER MODAL (URL only) */}
<Modal
  open={coverOpen}
  onClose={() => setCoverOpen(false)}
  title="Edit header photo"
  className="ring-2 ring-[#D23393]"
>
  <div className="space-y-4">
    {/* ocean-blue, bolder border + visible "Preview" when empty */}
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

    {/* Buttons: outlined pink + filled pink */}
    <div className="grid grid-cols-2 gap-4 pt-1">
      <button
        className="btn w-full uppercase shadow border-2 border-[#D23393] text-[#D23393] hover:bg-[#FFF2F8]"
        onClick={() => setCoverOpen(false)}
      >
        Cancel
      </button>
      <button
        className="btn btn-pink w-full uppercase shadow"
        onClick={saveCover}
      >
        Update header
      </button>
    </div>
  </div>
</Modal>



   {/* AVATAR MODAL (URL only) */}
<Modal
  open={avatarOpen}
  onClose={() => setAvatarOpen(false)}
  title="Edit profile picture"
  className="ring-2 ring-[#D23393]"
>
  <div className="space-y-4">
    {/* ocean-blue, bolder circle ring + "Preview" when empty */}
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

    {/* Buttons: outlined pink + filled pink */}
    <div className="grid grid-cols-2 gap-4 pt-1">
      <button
        className="btn w-full uppercase shadow border-2 border-[#D23393] text-[#D23393] hover:bg-[#FFF2F8]"
        onClick={() => setAvatarOpen(false)}
      >
        Cancel
      </button>
      <button
        className="btn btn-pink w-full uppercase shadow"
        onClick={saveAvatar}
      >
        Update photo
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

/* inline pencil icon */
function PencilIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.06 4.19l3.75 3.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
