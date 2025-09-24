// src/routes/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "@/components/profile/ProfileHeader";
import VenueManagerToggle from "@/components/profile/VenueManagerToggle";
import ProfileMedia from "@/components/profile/ProfileMedia";
import BookingsPanel from "@/components/profile/BookingsPanel";
import VenuesCarouselPanel from "@/components/profile/VenuesCarouselPanel";
import toast from "@/lib/toast";
import {
  AVATAR_KEY,
  COVER_KEY,
  PROFILE_NAME_KEY,
  PROFILE_EMAIL_KEY,
  clearAuth,
} from "@/lib/auth";
import { getMyProfile } from "@/lib/authApi";

/* ─────────────────────────── LocalStorage helpers ─────────────────────────── */
const lsGet = (key) =>
  typeof localStorage !== "undefined" ? localStorage.getItem(key) ?? "" : "";

const LS_NAME = lsGet(PROFILE_NAME_KEY);
const LS_EMAIL = lsGet(PROFILE_EMAIL_KEY);
const LS_AVATAR = lsGet(AVATAR_KEY);
const LS_COVER = lsGet(COVER_KEY);

/* ───────────────────────────────── Component ──────────────────────────────── */
export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: LS_NAME || "sunGypsy",
    email: LS_EMAIL || "you@example.com",
    venueManager: true, // ← keep original default
    avatarUrl: LS_AVATAR || "",
    coverUrl: LS_COVER || "",
    bio: "",
    created: null,
    _count: { venues: 0, bookings: 0 },
  });

  useEffect(() => {
    // Read fresh each mount in case LS changed previously
    const name =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(PROFILE_NAME_KEY)
        : "";
    if (!name) return;

    getMyProfile(name, { bookings: true, venues: true })
      .then((p) => {
        if (!p) return;
        setUser((u) => ({
          ...u,
          name: p.name ?? u.name,
          email: p.email ?? u.email,
          venueManager: Boolean(p.venueManager),
          avatarUrl: p.avatar?.url || u.avatarUrl,
          coverUrl: p.banner?.url || u.coverUrl,
          bio: p.bio ?? u.bio,
          created: p.created ?? u.created,
          _count: p._count ?? u._count,
        }));

        if (p.avatar?.url) localStorage.setItem(AVATAR_KEY, p.avatar.url);
        if (p.banner?.url) localStorage.setItem(COVER_KEY, p.banner.url);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        toast.error("Could not load your profile right now.");
      });
  }, []);

  function handleLogoutClick() {
    toast.confirm({
      title: "Log out?",
      message: "Hope to see you again soon!",
      confirmText: "Log out",
      cancelText: "Stay logged in",
      onConfirm: () => {
        clearAuth();
        toast.miniSuccess("Logged out");
        navigate("/login");
      },
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="card-sand overflow-hidden p-0">
        {/* Cover + Avatar + Modals */}
        <ProfileMedia
          user={user}
          onUpdated={(partial) => setUser((u) => ({ ...u, ...partial }))}
        >
          {/* Injected into the same stack under the avatar */}
          <ProfileHeader profile={user} />
          <VenueManagerToggle
            name={user.name}
            isManager={user.venueManager}
            onUpdated={(p) => setUser((u) => ({ ...u, ...p }))}
          />
        </ProfileMedia>

        {/* Content (keeps logout on the white card) */}
        <div className="px-6 pb-8 pt-0">
          <div className="mt-8 space-y-6">
            {/* Bookings carousels */}
            <BookingsPanel profileName={user.name} />

            {/* Always render; panel decides visibility via isManager */}
            <VenuesCarouselPanel
              profileName={user.name}
              isManager={user.venueManager}
            />
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleLogoutClick}
              className="text-ocean underline hover:no-underline"
              aria-label="Log out of your account"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
