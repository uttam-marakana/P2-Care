import { useEffect, useState } from 'react';
import { FaImage, FaTrash, FaUpload, FaXmark } from 'react-icons/fa6';
import { resolveMediaUrl, uploadImage, removeMedia } from '@/services/media';

export default function MediaUploader({ value = '', onChange, folder = 'general', label = 'Image' }) {
  const [preview, setPreview] = useState(value || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [mediaId, setMediaId] = useState(null);

  useEffect(() => setPreview(value || ''), [value]);

  const choose = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const item = await uploadImage(file, folder);
      setPreview(item.url);
      setMediaId(item.id || null);
      onChange(item.url, item);
    } catch (err) {
      setError(err.message || 'Unable to upload image.');
    } finally {
      setBusy(false);
    }
  };

  const clear = async () => {
    setError('');
    try {
      if (mediaId) await removeMedia(mediaId);
    } catch (err) {
      setError(err.message || 'Unable to remove the uploaded image.');
      return;
    }
    setPreview('');
    setMediaId(null);
    onChange('', null);
    // Mock/local media URLs contain the generated id in the path. Deletion is optional here;
    // content deletion is intentionally separate from media lifecycle management.
    if (!current) return;
  };

  return (
    <div className="rounded-2xl border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP or GIF · max 5 MB</p></div>
        {preview && <button type="button" onClick={clear} className="rounded-full p-2 hover:bg-muted" aria-label="Remove image"><FaXmark /></button>}
      </div>
      {preview ? <div className="mt-4 overflow-hidden rounded-xl border bg-muted"><img src={resolveMediaUrl(preview)} alt="Selected" className="h-48 w-full object-cover" /></div> : <div className="mt-4 grid h-32 place-items-center rounded-xl border border-dashed text-center text-xs text-muted-foreground"><FaImage className="mb-2 text-lg" />No image selected</div>}
      <div className="mt-4 flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">
          <FaUpload /> {busy ? 'Uploading...' : preview ? 'Replace image' : 'Upload image'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={choose} className="sr-only" />
        </label>
        {preview && <button type="button" onClick={clear} className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold"><FaTrash /> Remove</button>}
      </div>
      {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
