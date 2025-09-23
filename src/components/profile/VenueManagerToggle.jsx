import { useState } from "react";
import { getMyProfile, updateVenueManagerStatus } from "@/lib/authApi";
import {
  AVATAR_KEY,
  COVER_KEY,
  PROFILE_EMAIL_KEY,
  PROFILE_NAME_KEY,
} from "@/lib/auth";
import toast from "@/lib/toast";

export default function VenueManagerToggle({ name, isManager, onUpdated }) {
  const [saving, setSaving] = useState(false);
  const userName = name || localStorage.getItem(PROFILE_NAME_KEY) || "";

  function confirmToggle() {
    if (saving) return;

    const turningOn = !isManager;

    toast.confirm({
      title: turningOn ? "Become a Venue Manager?" : "Disable Venue Manager?",
      message: turningOn
        ? "You’ll be able to create and manage venues, and view related bookings."
        : "You can re-enable it anytime from your profile.",
      confirmText: turningOn ? "Yes, enable" : "Disable",
      cancelText: "Cancel",
      onConfirm: () => patch(turningOn),
    });
  }

  function onKeyDown(e) {
    if (saving) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      confirmToggle();
    }
  }

  async function patch(nextVal) {
    try {
      setSaving(true);
      if (!userName) throw new Error("Missing profile name for update.");

      await updateVenueManagerStatus(userName, { venueManager: nextVal });
      const p = await getMyProfile(userName, { bookings: true, venues: true });

      if (p?.avatar?.url) localStorage.setItem(AVATAR_KEY, p.avatar.url);
      if (p?.banner?.url) localStorage.setItem(COVER_KEY, p.banner.url);
      if (p?.email) localStorage.setItem(PROFILE_EMAIL_KEY, p.email);

      onUpdated?.({
        name: p?.name,
        email: p?.email,
        venueManager: !!p?.venueManager,
        avatarUrl: p?.avatar?.url || "",
        coverUrl: p?.banner?.url || "",
        bio: p?.bio,
        created: p?.created,
        _count: p?._count,
      });

      toast.success(
        nextVal
          ? "Venue Manager enabled — you can now create venues"
          : "Venue Manager disabled — re-enable anytime"
      );
    } catch (e) {
      toast.error(e?.message || "Could not update your manager status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="text-sm text-ocean">Venue manager</span>

      <div
        role="switch"
        aria-checked={isManager}
        aria-label="Toggle venue manager"
        aria-disabled={saving ? "true" : "false"}
        tabIndex={0}
        onClick={confirmToggle}
        onKeyDown={onKeyDown}
        className={[
          "relative inline-flex h-6 w-11 items-center rounded-full select-none",
          "transition-colors duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink/40",
          isManager ? "bg-pink-700" : "bg-pink-500",
          saving ? "cursor-wait" : "cursor-pointer",
        ].join(" ")}
      >
        <span
          className={[
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow",
            "transition-transform duration-200 ease-out",
            isManager ? "translate-x-5" : "translate-x-1",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
