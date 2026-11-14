import { useLanguage } from "@/context/LanguageContext";

function Field({ label, id, children }) {
  const { t } = useLanguage();

  return (
    <label
      htmlFor={id}
      className="mb-5 block text-xs font-bold text-[hsl(var(--foreground))]"
    >
      {t(label)}
      {children}
    </label>
  );
}

export default Field;
