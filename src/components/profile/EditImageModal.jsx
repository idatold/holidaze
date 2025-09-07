// src/components/profile/EditImageModal.jsx
import { useState } from "react";
import Modal from "@/components/ui/Modal";

const PINK = "#D23393";

export default function EditImageModal({ open, onClose, mode = "avatar", initialUrl = "", onSave }) {
  const [url, setUrl] = useState(initialUrl || "");
  const [error, setError] = useState("");

  function isValidUrl(str) {
    try {
      const u = new URL(str);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch { return false; }
  }

  function handleSave() {
    if (!url || !isValidUrl(url)) {
      setError("Image url is required");
      return;
    }
    onSave?.(url);
    setError("");
    onClose?.();
  }

  const preview = (
    <div className={mode === "avatar"
      ? "mx-auto h-24 w-24 overflow-hidden rounded-full bg-ocean"
      : "mx-auto aspect-[16/6] w-full overflow-hidden rounded bg-ocean"}>
      {url ? (
        <img src={url} alt="Preview" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white/90">Preview</div>
      )}
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "avatar" ? "Edit profile picture" : "Edit header photo"}
      className="ring-2 ring-[#D23393]"  /* pink border like your mock */
    >
      <div className="space-y-4">
        {preview}

        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); if (error) setError(""); }}
          placeholder="https://example.com/venue-image.jpg"
          className="w-full rounded-[5px] border border-[#D23393]/40 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D23393]"
        />

        {error && (
          <div className="flex items-center gap-2 rounded-[5px] border border-[#D23393] bg-[#D23393]/10 px-3 py-2 text-[#8A114E]">
            <span className="text-lg">⦿</span>
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="mt-2 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose}
            className="btn bg-white text-[#D23393] ring-1 ring-[#D23393] hover:bg-[#FFF2F8]">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn btn-pink">
            {mode === "avatar" ? "Update photo" : "Update header"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
