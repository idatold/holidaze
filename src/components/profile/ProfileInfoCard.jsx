// src/components/profile/ProfileInfoCard.jsx
export default function ProfileInfoCard({ profile }) {
  const venues = profile?._count?.venues ?? 0;
  const bookings = profile?._count?.bookings ?? 0;
  const memberSince = profile?.created
    ? new Date(profile.created).toLocaleDateString()
    : "—";
  const bio = (profile?.bio || "").trim();

  return (
    <div className="rounded-[5px] border border-[#006492]/30 bg-white/60 p-4">
      <h2 className="mb-2 font-higuen text-ocean text-xl">About</h2>

      <p className="text-sm text-ocean/80">
        {bio || "No bio yet."}
      </p>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-ocean/60">Venues</dt>
          <dd className="font-semibold text-ocean">{venues}</dd>
        </div>
        <div>
          <dt className="text-ocean/60">Bookings</dt>
          <dd className="font-semibold text-ocean">{bookings}</dd>
        </div>
        <div>
          <dt className="text-ocean/60">Member since</dt>
          <dd className="font-semibold text-ocean">{memberSince}</dd>
        </div>
      </dl>
    </div>
  );
}
