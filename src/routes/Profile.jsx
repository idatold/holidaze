// src/routes/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "@/components/profile/ProfileHeader";
import VenueManagerToggle from "@/components/profile/VenueManagerToggle";
import ProfileMedia from "@/components/profile/ProfileMedia";
import BookingsPanel from "@/components/profile/BookingsPanel";
import MyVenuesPanel from "@/components/profile/MyVenuesPanel";
import toast from "@/lib/toast";
import {
  AVATAR_KEY,
  COVER_KEY,
  PROFILE_NAME_KEY,
  PROFILE_EMAIL_KEY,
  clearAuth,
} from "@/lib/auth";
import { getMyProfile } from "@/lib/authApi";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "sunGypsy",
    email: "you@example.com",
    venueManager: true,
    avatarUrl: "",
    coverUrl: "",
    bio: "",
    created: undefined,
    _count: { venues: 0, bookings: 0 },
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
            bio: p?.bio ?? u.bio,
            created: p?.created ?? u.created,
            _count: p?._count ?? u._count,
          }));
          if (p?.avatar?.url) localStorage.setItem(AVATAR_KEY, p.avatar.url);
          if (p?.banner?.url) localStorage.setItem(COVER_KEY, p.banner.url);
        })
        .catch(() => {});
    }
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
            <BookingsPanel />
            <MyVenuesPanel isManager={user.venueManager} />
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
