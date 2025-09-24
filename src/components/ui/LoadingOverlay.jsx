import Spinner from "./Spinner";
import { useUIStore } from "@/store/uiStore";

export default function LoadingOverlay() {
  const loading = useUIStore((s) => s.loadingGlobal);
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9998] grid place-items-center bg-black/20 backdrop-blur-[1px]">
      <div className="flex items-center gap-3 rounded-[10px] bg-white p-5 shadow-lg ring-1 ring-black/10">
        <Spinner size="lg" label="Loading" />
        <span className="font-arsenal text-ink">Loading…</span>
      </div>
    </div>
  );
}
