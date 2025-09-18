// src/components/profile/EditImageModal.jsx
import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";

export default function EditImageModal({
  open,
  onClose,
  mode = "avatar",       // "avatar" | "cover"
  initialUrl = "",
  onSave,                // (url: string) => void
}) {
  const [url, setUrl] = useState(initialUrl || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setUrl(initialUrl || "");
      setError("");
    }
  }, [open, initialUrl]);

  const isHttp = (s) => /^https?:\/\//i.test(s || "");

  function handleSave() {
    const val = (url || "").trim();
    if (!isHttp(val)) {
      setError("Enter a valid URL starting with http:// or https://");
      return;
    }
    onSave?.(val);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  }

  /* ---------- Previews (ocean placeholder when empty) ---------- */

  const avatarPreview = (
    <div
      className={[
        "relative mx-auto h-28 w-28 overflow-hidden rounded-full shadow-sm",
        isHttp(url) ? "bg-sand" : "bg-ocean",        // ← ocean when empty
      ].join(" ")}
    >
      {isHttp(url) ? (
        <img
          src={url}
          alt="Avatar preview"
          className="block h-full w-full object-cover select-none pointer-events-none"
          draggable="false"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white/90">
          Preview
        </div>
      )}
    </div>
  );

  const coverPreview = (
    <div
      className={[
        "relative aspect-[16/6] w-full overflow-hidden rounded shadow-sm",
        isHttp(url) ? "bg-white" : "bg-ocean",       // ← ocean when empty
      ].join(" ")}
    >
      {isHttp(url) ? (
        <img
          src={url}
          alt="Header preview"
          className="block h-full w-full object-cover select-none pointer-events-none"
          draggable="false"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/90">
          Preview
        </div>
      )}
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "avatar" ? "Edit profile picture" : "Edit header photo"}
      className="ring-2 ring-pink-500"   // brand pink modal frame
    >
      <div className="space-y-4">
        {mode === "avatar" ? avatarPreview : coverPreview}

        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={onKeyDown}
          placeholder={
            mode === "avatar"
              ? "https://images.unsplash.com/...&w=256"
              : "https://images.unsplash.com/...&w=1600"
          }
          className="w-full rounded-[5px] border border-pink-500 bg-white px-4 py-3
                     focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        {error && (
          <div className="flex items-center gap-2 rounded-[5px] border border-pink-500 bg-pink-500/10 px-3 py-2 text-pink-700">
            <span className="text-lg">⦿</span>
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-1">
          <button type="button" onClick={onClose} className="btn btn-outline-pink w-full uppercase">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn btn-pink w-full uppercase shadow">
            {mode === "avatar" ? "Update photo" : "Update header"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
