import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const SITE_NAME = "P2Care Hospital";
const SITE_URL = (
  import.meta.env.VITE_SITE_URL || window.location.origin
).replace(/\/$/, "");
const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/images/site-share-card.svg`;
const DEFAULT_DESCRIPTION =
  "Patient-first hospital care, specialist services, appointment booking and support from the P2Care Hospital care team.";

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
  const { t, language } = useLanguage();
  useEffect(() => {
    const localizedTitle = t(title);
    const localizedDescription = t(description);
    document.title = localizedTitle
      ? `${localizedTitle} | ${SITE_NAME}`
      : SITE_NAME;
    const href = canonical || `${SITE_URL}${window.location.pathname}`;
    upsertMeta("description", localizedDescription);
    upsertMeta("robots", noindex ? "noindex,nofollow" : "index,follow");
    upsertMeta("og:title", document.title, "property");
    upsertMeta("og:description", localizedDescription, "property");
    upsertMeta("og:type", "website", "property");
    upsertMeta("og:site_name", SITE_NAME, "property");
    upsertMeta("og:url", href, "property");
    upsertMeta("og:image", image || DEFAULT_SOCIAL_IMAGE, "property");
    upsertMeta("og:image:alt", "P2Care Hospital", "property");
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", document.title);
    upsertMeta("twitter:description", localizedDescription);
    upsertMeta("twitter:image", image || DEFAULT_SOCIAL_IMAGE);

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
  }, [title, description, canonical, image, noindex, schema, t, language]);
  return null;
}

export default SEO;
