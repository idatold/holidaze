// src/components/profile/ProfileHeader.jsx
export default function ProfileHeader({ profile }) {
  if (!profile) return null;

  return (
    <div className="mt-3 text-center">
      <h1 className="font-higuen text-ocean text-2xl">{profile.name}</h1>
     
    </div>
  );
}
