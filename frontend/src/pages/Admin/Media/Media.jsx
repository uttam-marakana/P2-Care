import { useEffect, useState } from "react";
import { FaCopy, FaImage, FaTrash, FaUpload } from "react-icons/fa6";
import {
  listMedia,
  removeMedia,
  uploadImage,
  resolveMediaUrl,
} from "@/services/media";

export default function AdminMedia() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await listMedia());
    } catch (err) {
      setError(err.message || "Unable to load media.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await uploadImage(file, "general");
      setMessage("Image uploaded successfully.");
      await load();
    } catch (err) {
      setError(err.message || "Unable to upload image.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this media file? This cannot be undone."))
      return;
    setError("");
    try {
      await removeMedia(id);
      await load();
      setMessage("Media file deleted.");
    } catch (err) {
      setError(err.message || "Unable to delete media.");
    }
  };

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(resolveMediaUrl(url));
      setMessage("Media URL copied.");
    } catch (_) {
      setError("Unable to copy the media URL.");
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">
            Media management
          </p>
          <h2 className="mt-2 font-display text-5xl">Media library</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Upload, preview, reuse and remove images used across the hospital
            website.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-white">
          <FaUpload />
          {busy ? "Uploading..." : "Upload image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={busy}
            onChange={upload}
            className="sr-only"
          />
        </label>
      </div>
      {(message || error) && (
        <div
          className={`mb-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
        >
          {error || message}
        </div>
      )}
      <div className="mb-5 rounded-2xl border bg-card p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Storage rules:</strong> JPG, PNG,
        WEBP and GIF only. Maximum file size is 5 MB. Mock mode stores files
        locally under the backend uploads directory; production mode also stores
        media locally on the backend; Firebase Storage is intentionally not
        used.
      </div>
      {loading ? (
        <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
          Loading media...
        </div>
      ) : !items.length ? (
        <div className="grid place-items-center rounded-2xl border border-dashed bg-card p-16 text-center">
          <FaImage className="mb-4 text-2xl text-[hsl(var(--primary))]" />
          <p className="font-semibold">No media files yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload an image to start building your media library.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
              <div className="aspect-[4/3] bg-muted">
                <img
                  src={resolveMediaUrl(item.url)}
                  alt={item.name || "Uploaded media"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="truncate text-sm font-semibold" title={item.name}>
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.mimeType || "image"}
                  {item.size
                    ? ` · ${(item.size / 1024 / 1024).toFixed(2)} MB`
                    : ""}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => copy(item.url)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold"
                  >
                    <FaCopy /> Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-xs font-semibold text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
