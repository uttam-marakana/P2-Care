import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { listContent } from "@/services/cms";
import {
  doctors as fallbackDoctors,
  specialties as fallbackServices,
  articles as fallbackArticles,
  faqs as fallbackFaqs,
} from "@/data";

const CmsContext = createContext(null);

const normalizeDoctors = (items) =>
  items.map((d) => ({
    ...d,
    initials:
      d.initials ||
      d.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    tone: d.tone || "from-[#d5e9e4] via-[#bddbd7] to-[#a4c3c9]",
    languages: d.languages?.length
      ? d.languages
      : ["English", "Hindi", "Punjabi"],
  }));
const normalizeServices = (items) =>
  items.map((s) => ({
    ...s,
    id: s.id || s.slug || s.name,
    icon: s.icon || "heart",
  }));
const normalizeArticles = (items) =>
  items.map((a) => ({
    ...a,
    tone: a.tone || "from-[#d5e9e4] via-[#bddbd7] to-[#a4c3c9]",
    read: a.read || "5 min read",
  }));

export function CmsProvider({ children }) {
  const [content, setContent] = useState({
    doctors: fallbackDoctors,
    specialties: fallbackServices,
    articles: fallbackArticles,
    faqs: fallbackFaqs,
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      listContent("doctors"),
      listContent("services"),
      listContent("articles"),
      listContent("faqs"),
    ])
      .then(([doctors, specialties, articles, faqs]) => {
        if (!active) return;
        setContent({
          doctors: doctors.length ? normalizeDoctors(doctors) : fallbackDoctors,
          specialties: specialties.length
            ? normalizeServices(specialties)
            : fallbackServices,
          articles: articles.length
            ? normalizeArticles(articles)
            : fallbackArticles,
          faqs: faqs.length ? faqs : fallbackFaqs,
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => content, [content]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCmsData() {
  return (
    useContext(CmsContext) ?? {
      doctors: fallbackDoctors,
      specialties: fallbackServices,
      articles: fallbackArticles,
      faqs: fallbackFaqs,
    }
  );
}
