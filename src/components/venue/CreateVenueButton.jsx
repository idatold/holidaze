// components/venue/CreateVenueButton.jsx
import { useUIStore } from "@/store/uiStore";

export default function CreateVenueButton() {
  const openCreateVenue = useUIStore((s) => s.openCreateVenue);
  return <button className="btn" onClick={openCreateVenue}>Create Venue</button>;
}
