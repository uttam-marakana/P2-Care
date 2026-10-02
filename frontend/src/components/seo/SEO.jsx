import { useEffect } from "react";

const SITE_NAME = "P2Care Hospital Mohali";
const SITE_URL = (
  import.meta.env.VITE_SITE_URL || window.location.origin
).replace(/\/$/, "");
const DEFAULT_DESCRIPTION =
  "Patient-first hospital care, specialists, appointments and emergency services in Mohali, Punjab.";

function upsertMeta(name, content, attr = "name") {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image,
  noindex = false,
  schema,
}) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    upsertMeta("description", description);
    upsertMeta("robots", noindex ? "noindex,nofollow" : "index,follow");
    upsertMeta("og:title", document.title, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("og:type", "website", "property");
    upsertMeta("og:site_name", SITE_NAME, "property");
    if (image) upsertMeta("og:image", image, "property");
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", document.title);
    upsertMeta("twitter:description", description);

    const href = canonical || `${SITE_URL}${window.location.pathname}`;
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = href;

    const existing = document.head.querySelector("script[data-p2care-schema]");
    if (existing) existing.remove();
    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.p2careSchema = "true";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
    return () => {
      const current = document.head.querySelector("script[data-p2care-schema]");
      if (current) current.remove();
    };
  }, [title, description, canonical, image, noindex, schema]);
  return null;
}

export default SEO;
