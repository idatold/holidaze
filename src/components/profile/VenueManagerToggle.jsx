import { useState } from "react";
import { getMyProfile, updateVenueManagerStatus } from "@/lib/authApi";
import { AVATAR_KEY, COVER_KEY, PROFILE_EMAIL_KEY, PROFILE_NAME_KEY } from "@/lib/auth";
import { toast } from "@/components/feedback/Toaster";

export default function VenueManagerToggle({ name, isManager, onUpdated }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const userName = name || localStorage.getItem(PROFILE_NAME_KEY) || "";

  const handleClick = () => {
    if (saving) return; // ignore clicks while saving (no disabled attr → no opacity)
    if (!isManager) setConfirmOpen(true); // turning ON → confirm
    else patch(false);                    // turning OFF → immediate
  };

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

      if (nextVal) {
  toast.success("Venue Manager enabled — you can now create venues");
} else {
  // use brand pink for disable as well
  toast.success("Venue Manager disabled — re-enable anytime");
}

    } catch (e) {
      toast.error(e?.message || "Could not update your manager status");
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-ocean">Venue manager</span>

        {/* TRACK: brand pink OFF, darker brand pink ON. No opacity changes. */}
        <button
          type="button"
          role="switch"
          aria-checked={isManager}
          aria-label="Toggle venue manager"
          aria-disabled={saving}
          onClick={handleClick}
          className={[
            "relative inline-flex h-6 w-11 items-center rounded-full",
            "transition-colors duration-200 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink/40",
            isManager ? "bg-pink-700 hover:bg-pink-700" : "bg-pink hover:bg-pink-600",
            saving ? "cursor-wait" : "cursor-pointer",
          ].join(" ")}
        >
          {/* KNOB */}
          <span
            className={[
              "inline-block h-5 w-5 transform rounded-full bg-white shadow",
              "transition-transform duration-200 ease-out",
            , isManager ? "translate-x-5" : "translate-x-1"].join(" ")}
          />
        </button>
      </div>

      {/* Confirm dialog when turning ON */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 p-4"
          aria-modal="true"
          role="dialog"
        >
          <div className="w-full max-w-sm rounded-[10px] bg-white p-5 shadow-xl">
            <h3 className="mb-2 font-semibold text-ocean-700">Become a Venue Manager?</h3>
            <p className="mb-4 text-sm text-ocean-800">
              You’ll be able to create and manage venues, and view related bookings.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="btn btn-outline-pink w-full uppercase"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-pink w-full uppercase shadow"
                onClick={() => patch(true)}
              >
                {saving ? "Enabling…" : "Yes, enable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
