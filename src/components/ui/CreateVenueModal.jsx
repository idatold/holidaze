// components/ui/CreateVenueModal.jsx
import { useUIStore } from "@/store/uiStore";

export default function CreateVenueModal() {
  const isOpen = useUIStore((s) => s.isCreateVenueOpen);
  const close = useUIStore((s) => s.closeCreateVenue);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-lg">
        {/* form goes here */}
        <button className="btn mt-4" onClick={close}>Close</button>
      </div>
    </div>
  );
}
