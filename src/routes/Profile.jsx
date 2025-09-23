import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "@/components/profile/ProfileHeader";
import VenueManagerToggle from "@/components/profile/VenueManagerToggle";
import ProfileMedia from "@/components/profile/ProfileMedia";
import BookingsPanel from "@/components/profile/BookingsPanel";
import VenuesCarouselPanel from "@/components/profile/VenuesCarouselPanel"; // ⬅️ NEW
import toast from "@/lib/toast";
import {
  AVATAR_KEY,
  COVER_KEY,
  PROFILE_NAME_KEY,
  PROFILE_EMAIL_KEY,
  clearAuth,
} from "@/lib/auth";
import { getMyProfile } from "@/lib/authApi";

// Synchronous localStorage read so first render gets the real values
const LS_NAME =
  typeof localStorage !== "undefined" ? localStorage.getItem(PROFILE_NAME_KEY) : "";
const LS_EMAIL =
  typeof localStorage !== "undefined" ? localStorage.getItem(PROFILE_EMAIL_KEY) : "";
const LS_AVATAR =
  typeof localStorage !== "undefined" ? localStorage.getItem(AVATAR_KEY) : "";
const LS_COVER =
  typeof localStorage !== "undefined" ? localStorage.getItem(COVER_KEY) : "";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: LS_NAME || "sunGypsy",
    email: LS_EMAIL || "you@example.com",
    venueManager: true,
    avatarUrl: LS_AVATAR || "",
    coverUrl: LS_COVER || "",
    bio: "",
    created: undefined,
    _count: { venues: 0, bookings: 0 },
  });

  useEffect(() => {
    const name = LS_NAME;
    if (!name) return;

    getMyProfile(name, { bookings: true, venues: true })
      .then((p) => {
        setUser((u) => ({
          ...u,
          name: p?.name || u.name,
          email: p?.email || u.email,
          venueManager: Boolean(p?.venueManager),
          avatarUrl: p?.avatar?.url || u.avatarUrl,
          coverUrl: p?.banner?.url || u.coverUrl,
          bio: p?.bio ?? u.bio,
          created: p?.created ?? u.created,
          _count: p?._count ?? u._count,
        }));
        if (p?.avatar?.url) localStorage.setItem(AVATAR_KEY, p.avatar.url);
        if (p?.banner?.url) localStorage.setItem(COVER_KEY, p.banner.url);
      })
      .catch(() => {});
  }, []);

  function handleLogoutClick() {
    toast.confirm({
      title: "Logging out?",
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
      <div className="card-sand p-0 overflow-hidden">
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

            {/* NEW: latest 6 venues carousel (only shows if venueManager) */}
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
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
