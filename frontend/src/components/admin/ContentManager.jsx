import { useEffect, useMemo, useState } from "react";
import {
  FaMagnifyingGlass,
  FaPenToSquare,
  FaPlus,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import { listContent, removeContent, saveContent } from "@/services/cms";
import MediaUploader from "@/components/admin/MediaUploader";

const configs = {
  doctors: {
    label: "Doctors",
    singular: "Doctor",
    fields: [
      ["name", "Name", "input", true],
      ["slug", "Slug", "input", false],
      ["specialty", "Specialty", "input", true],
      ["credentials", "Credentials", "input"],
      ["experience", "Experience", "input"],
      ["availability", "Availability", "input"],
      ["languages", "Languages", "input"],
      ["image_url", "Profile image", "media"],
      ["initials", "Initials", "input"],
      ["tone", "Profile tone", "input"],
      ["bio", "Biography", "textarea"],
    ],
    defaults: { status: "published" },
  },
  services: {
    label: "Services",
    singular: "Service",
    fields: [
      ["name", "Name", "input", true],
      ["slug", "Slug", "input"],
      ["detail", "Description", "textarea", true],
      ["icon", "Icon", "input"],
      ["image_url", "Service image", "media"],
    ],
    defaults: { status: "published" },
  },
  articles: {
    label: "Articles",
    singular: "Article",
    fields: [
      ["title", "Title", "input", true],
      ["slug", "Slug", "input"],
      ["category", "Category", "input"],
      ["excerpt", "Excerpt", "textarea"],
      ["content", "Content", "textarea", true],
      ["image_url", "Featured image", "media"],
      ["date", "Publish date", "input"],
      ["read", "Read time", "input"],
      ["tone", "Editorial tone", "input"],
    ],
    defaults: { status: "draft" },
  },
  faqs: {
    label: "FAQs",
    singular: "FAQ",
    fields: [
      ["q", "Question", "input", true],
      ["a", "Answer", "textarea", true],
      ["category", "Category", "input"],
    ],
    defaults: { status: "published" },
  },
};

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function displayTitle(type, item) {
  return item.name || item.title || item.q || "Untitled";
}

export default function ContentManager({ type }) {
  const config = configs[type];
  const empty = useMemo(
    () => ({
      ...config.defaults,
      ...Object.fromEntries(config.fields.map(([key]) => [key, ""])),
    }),
    [config],
  );
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await listContent(type, { includeDrafts: true }));
    } catch (err) {
      setError(err.message || `Unable to load ${config.label.toLowerCase()}.`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoading(true);
      try {
        const data = await listContent(type, { includeDrafts: true });
        if (active) setItems(data);
      } catch (err) {
        if (active) {
          setItems([]);
          setError(
            err.message || `Unable to load ${config.label.toLowerCase()}.`,
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [type, config.label]);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const title = displayTitle(type, item).toLowerCase();
        const category = String(
          item.category || item.specialty || "",
        ).toLowerCase();
        return (
          (!query.trim() ||
            `${title} ${category}`.includes(query.trim().toLowerCase())) &&
          (statusFilter === "all" || item.status === statusFilter)
        );
      }),
    [items, query, statusFilter, type],
  );

  const updateField = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !editing && !current.slug)
        next.slug = slugify(value);
      if (key === "title" && !editing && !current.slug)
        next.slug = slugify(value);
      return next;
    });
  };

  const reset = () => {
    setEditing(null);
    setForm(empty);
    setMessage("");
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = { ...form };
      if (!payload.slug && (payload.name || payload.title))
        payload.slug = slugify(payload.name || payload.title);
      if (payload.languages && typeof payload.languages === "string")
        payload.languages = payload.languages
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
      await saveContent(type, {
        ...payload,
        ...(editing ? { id: editing } : {}),
      });
      reset();
      setMessage(`${config.singular} saved successfully.`);
      await load();
    } catch (err) {
      setError(
        err.message || `Unable to save ${config.singular.toLowerCase()}.`,
      );
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      ...empty,
      ...item,
      languages: Array.isArray(item.languages)
        ? item.languages.join(", ")
        : item.languages || "",
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (
      !window.confirm(
        `Delete this ${config.singular.toLowerCase()}? This cannot be undone.`,
      )
    )
      return;
    try {
      await removeContent(type, id);
      await load();
    } catch (err) {
      setError(err.message || "Unable to delete record.");
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">
            Content management
          </p>
          <h2 className="mt-2 font-display text-5xl">{config.label}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Create, edit, publish and maintain {config.label.toLowerCase()} from
            one place.
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => {
              setForm(empty);
              setMessage("");
              setError("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-white"
          >
            <FaPlus /> Add {config.singular}
          </button>
        )}
      </div>

      {(message || error) && (
        <div
          className={`mb-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
        >
          {error || message}
        </div>
      )}

      <form
        onSubmit={submit}
        className="mb-8 rounded-2xl border bg-card p-5 shadow-sm"
      >
        <div className="mb-5 flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="font-semibold">
              {editing ? `Edit ${config.singular}` : `Add ${config.singular}`}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Required fields are marked with *.
            </p>
          </div>
          {editing && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full p-2 hover:bg-muted"
            >
              <FaXmark />
            </button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {config.fields.map(([key, label, kind, required]) =>
            kind === "media" ? (
              <div key={key} className="md:col-span-2">
                <MediaUploader
                  label={label}
                  value={form[key] || ""}
                  folder={type}
                  onChange={(url) => updateField(key, url)}
                />
              </div>
            ) : (
              <label
                key={key}
                className={`text-sm font-semibold ${kind === "textarea" && (key === "content" || key === "bio" || key === "a") ? "md:col-span-2" : ""}`}
              >
                {label}
                {required ? " *" : ""}
                {kind === "textarea" ? (
                  <textarea
                    required={required}
                    value={form[key] ?? ""}
                    onChange={(e) => updateField(key, e.target.value)}
                    rows={key === "content" ? 10 : 4}
                    className="mt-2 w-full rounded-xl border bg-background px-3 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.25)]"
                  />
                ) : (
                  <input
                    required={required}
                    value={
                      Array.isArray(form[key])
                        ? form[key].join(", ")
                        : (form[key] ?? "")
                    }
                    onChange={(e) => updateField(key, e.target.value)}
                    className="mt-2 w-full rounded-xl border bg-background px-3 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.25)]"
                  />
                )}
              </label>
            ),
          )}
          <label className="text-sm font-semibold">
            Status
            <select
              value={form.status || "published"}
              onChange={(e) => updateField("status", e.target.value)}
              className="mt-2 w-full rounded-xl border bg-background px-3 py-2.5 text-sm font-normal"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            disabled={saving}
            className="rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editing
                ? `Update ${config.singular}`
                : `Create ${config.singular}`}
          </button>
          {editing && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full border px-5 py-3 text-sm font-bold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mb-4 grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-[1fr_auto]">
        <label className="relative block text-xs font-semibold">
          <FaMagnifyingGlass
            className="absolute left-3 top-9 text-muted-foreground"
            size={13}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${config.label.toLowerCase()}...`}
            className="mt-2 w-full rounded-xl border bg-background py-2.5 pl-9 pr-3 text-sm font-normal"
          />
        </label>
        <label className="text-xs font-semibold">
          Status
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-2 rounded-xl border bg-background px-3 py-2.5 text-sm font-normal"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>
      </div>

      <div className="mb-3 text-xs text-muted-foreground">
        {filtered.length} record{filtered.length === 1 ? "" : "s"}
      </div>
      <div className="grid gap-3">
        {loading && (
          <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
            Loading {config.label.toLowerCase()}...
          </div>
        )}
        {!loading && !filtered.length && (
          <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
            No {config.label.toLowerCase()} found.
          </div>
        )}
        {!loading &&
          filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="truncate">
                    {displayTitle(type, item)}
                  </strong>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${item.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {item.status || "draft"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {item.specialty ||
                    item.category ||
                    item.detail ||
                    item.a ||
                    item.excerpt ||
                    "No additional summary."}
                </p>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  {item.slug || item.id}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => edit(item)}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold"
                >
                  <FaPenToSquare /> Edit
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-red-600"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
