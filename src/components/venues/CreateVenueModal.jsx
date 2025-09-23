import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { createVenue, updateVenue } from "@/lib/venues";
import toast from "@/lib/toast";

/* amenity icons */
import wifiIcon from "@/assets/icons/wifi-ocean.svg";
import parkingIcon from "@/assets/icons/parking-ocean.svg";
import breakfastIcon from "@/assets/icons/breakfast-ocean.svg";
import petsIcon from "@/assets/icons/pets-ocean.svg";

/* soft, elevated input look */
const INPUT_CLS = [
  "input-auth",
  "bg-white",
  "ring-1 ring-black/5",
  "shadow",
].join(" ");

/**
 * Reusable modal for CREATE and EDIT.
 * Props:
 * - open: boolean
 * - onClose: fn
 * - onSaved: fn(venue)   // fires on both create + edit
 * - onCreated?: fn(venue) // optional, kept for backward-compat (create only)
 * - initial?: venueObj    // when present, modal switches to Edit mode
 * - mode?: "create" | "edit" (optional; inferred from initial if omitted)
 */
export default function CreateVenueModal({
  open,
  onClose,
  onSaved,
  onCreated,
  initial = null,
  mode,
}) {
  const isEdit = (mode || (initial?.id ? "edit" : "create")) === "edit";

  // Placeholders (UI only) for CREATE mode
  const PH = {
    name: "Sunset Hotel",
    description: "A lovely getaway far awayyy....",
    price: "100",
    images: "https://example.com/venue-image.jpg, https://example.com/another.jpg",
    maxGuests: "2",
    rating: "5",
    address: "123. Sun st.",
    zip: "0000",
    city: "Athens",
    country: "Greece",
  };

  // Form state. In CREATE: start empty so placeholders show. In EDIT: hydrated below.
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    mediaUrls: "",
    maxGuests: "",
    rating: "",
    meta: { wifi: true, parking: true, breakfast: true, pets: true },
    location: {
      address: "",
      zip: "",
      city: "",
      country: "",
      continent: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setErr] = useState("");

  // Hydrate form when opening (edit fills values; create stays empty to show placeholders)
  useEffect(() => {
    if (!open) return;
    setErr("");
    setSubmitting(false);

    if (isEdit && initial) {
      const mediaUrls = Array.isArray(initial?.media)
        ? initial.media.map((m) => m?.url).filter(Boolean).join(", ")
        : initial?.media?.[0]?.url || "";

      setForm({
        name: initial?.name ?? "",
        description: initial?.description ?? "",
        price: String(initial?.price ?? ""),
        mediaUrls,
        maxGuests: String(initial?.maxGuests ?? ""),
        rating: String(initial?.rating ?? ""),
        meta: {
          wifi: !!initial?.meta?.wifi,
          parking: !!initial?.meta?.parking,
          breakfast: !!initial?.meta?.breakfast,
          pets: !!initial?.meta?.pets,
        },
        location: {
          address: initial?.location?.address ?? "",
          zip: initial?.location?.zip ?? "",
          city: initial?.location?.city ?? "",
          country: initial?.location?.country ?? "",
          continent: initial?.location?.continent ?? "",
        },
      });
    } else {
      // reset to empty for placeholders
      setForm((f) => ({
        ...f,
        name: "",
        description: "",
        price: "",
        mediaUrls: "",
        maxGuests: "",
        rating: "",
        location: { address: "", zip: "", city: "", country: "", continent: "" },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, initial?.id]);

  function setField(path, value) {
    setForm((f) => {
      const next = { ...f };
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = { ...cur[parts[i]] };
        cur = cur[parts[i]];
      }
      cur[parts.at(-1)] = value;
      return next;
    });
  }

  async function onSubmit(e) {
    e?.preventDefault?.();
    setErr("");
    try {
      setSubmitting(true);

      const urls = String(form.mediaUrls || "")
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter((u) => /^https?:\/\//i.test(u));

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        maxGuests: Number(form.maxGuests),
        // keep UI as placeholder but use a sensible default (5) if left blank
        rating: Number(form.rating === "" ? 5 : form.rating),
        meta: { ...form.meta },
        location: { ...form.location },
        media: urls.map((url) => ({ url, alt: "" })),
        mediaUrl: urls[0] || "", // back-compat
      };

      let result;
      if (isEdit && initial?.id) {
        result = await updateVenue(initial.id, payload);
        toast.miniSuccess("Venue updated");
      } else {
        result = await createVenue(payload);
        toast.miniSuccess("Venue created");
        onCreated?.(result); // backward-compat
      }

      onSaved?.(result);
      onClose?.();
    } catch (err) {
      setErr(
        err?.message ||
          (isEdit ? "Could not update venue" : "Could not create venue")
      );
    } finally {
      setSubmitting(false);
    }
  }

  const title = isEdit ? "Edit venue" : "Create new venue";
  const submitLabel = isEdit
    ? submitting
      ? "Saving…"
      : "Save changes"
    : submitting
    ? "Creating…"
    : "Create venue";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      backdropClassName="bg-white/80 backdrop-blur-md"
      panelClassName="max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto"
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* BASIC */}
        <div className="grid gap-3">
          <label className="text-ocean text-sm font-semibold">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder={PH.name}
            className={INPUT_CLS}
          />

          <label className="text-ocean text-sm font-semibold">Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder={PH.description}
            className={INPUT_CLS}
          />
        </div>

        {/* PRICE + IMAGES* */}
        <div className="grid gap-3">
          <label className="text-ocean text-sm font-semibold">
            Price per night
          </label>
          <input
            type="number"
            min="0"
            step="1"
            required
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            placeholder={PH.price}
            className={INPUT_CLS}
          />

          <label className="text-ocean text-sm font-semibold">Images*</label>
          <textarea
            rows={3}
            value={form.mediaUrls}
            onChange={(e) => setField("mediaUrls", e.target.value)}
            className={INPUT_CLS}
            placeholder={PH.images}
          />
          <p className="text-[11px] text-gray-500">
            *Optional, separate url`s with commas.
          </p>
        </div>

        {/* MAX GUESTS + RATING */}
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label className="text-ocean text-sm font-semibold">
              Max guests
            </label>
            <input
              type="number"
              min="1"
              step="1"
              required
              value={form.maxGuests}
              onChange={(e) => setField("maxGuests", e.target.value)}
              placeholder={PH.maxGuests}
              className={INPUT_CLS}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-ocean text-sm font-semibold">
              Rating out of 5
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => setField("rating", e.target.value)}
              placeholder={PH.rating}
              className={INPUT_CLS}
            />
          </div>
        </div>

        {/* INCLUDED (with underline) */}
        <div className="space-y-3">
          <h4 className="text-ocean font-semibold border-b border-ocean w-[calc(100%-5px)] pb-1">
            Included
          </h4>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 text-sm text-ink">
              <img src={wifiIcon} alt="" className="h-5 w-5" />
              <input
                type="checkbox"
                className="accent-pink-500"
                checked={!!form.meta.wifi}
                onChange={(e) => setField("meta.wifi", e.target.checked)}
              />
              <span>Wi-Fi</span>
            </label>

            <label className="flex items-center gap-3 text-sm text-ink">
              <img src={parkingIcon} alt="" className="h-5 w-5" />
              <input
                type="checkbox"
                className="accent-pink-500"
                checked={!!form.meta.parking}
                onChange={(e) => setField("meta.parking", e.target.checked)}
              />
              <span>Parking</span>
            </label>

            <label className="flex items-center gap-3 text-sm text-ink">
              <img src={breakfastIcon} alt="" className="h-5 w-5" />
              <input
                type="checkbox"
                className="accent-pink-500"
                checked={!!form.meta.breakfast}
                onChange={(e) => setField("meta.breakfast", e.target.checked)}
              />
              <span>Breakfast</span>
            </label>

            <label className="flex items-center gap-3 text-sm text-ink">
              <img src={petsIcon} alt="" className="h-5 w-5" />
              <input
                type="checkbox"
                className="accent-pink-500"
                checked={!!form.meta.pets}
                onChange={(e) => setField("meta.pets", e.target.checked)}
              />
              <span>Pets allowed</span>
            </label>
          </div>
        </div>

        {/* LOCATION (with underline) */}
        <div className="space-y-3">
          <h4 className="text-ocean font-semibold border-b border-ocean w-[calc(100%-5px)] pb-1">
            Location
          </h4>

          <div className="grid gap-2">
            <label className="text-ocean text-sm font-semibold">Address</label>
            <input
              value={form.location.address}
              onChange={(e) => setField("location.address", e.target.value)}
              placeholder={PH.address}
              className={INPUT_CLS}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <label className="text-ocean text-sm font-semibold">Zip</label>
              <input
                value={form.location.zip}
                onChange={(e) => setField("location.zip", e.target.value)}
                placeholder={PH.zip}
                className={INPUT_CLS}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-ocean text-sm font-semibold">City</label>
              <input
                value={form.location.city}
                onChange={(e) => setField("location.city", e.target.value)}
                placeholder={PH.city}
                className={INPUT_CLS}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-ocean text-sm font-semibold">Country</label>
            <input
              value={form.location.country}
              onChange={(e) => setField("location.country", e.target.value)}
              placeholder={PH.country}
              className={INPUT_CLS}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-[5px] border border-pink-500 bg-pink-500/10 px-3 py-2 text-pink-700">
            <span className="text-lg">⦿</span>
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline-pink w-full uppercase"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-pink w-full uppercase shadow"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
