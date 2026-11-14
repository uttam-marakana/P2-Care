import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { FaBell, FaFileLines, FaGaugeHigh, FaRightFromBracket } from "react-icons/fa6";
import { Shell } from "@/components/layout";
import { firebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { SEO } from "@/components/seo";
import { useLanguage } from "@/context/LanguageContext";

const links = [
  ["/account", "Overview", FaGaugeHigh, true],
  ["/account/reports", "My reports", FaFileLines],
  ["/account/notifications", "Notifications", FaBell],
];

export default function PatientLayout() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const logout = async () => {
    if (firebaseAuth) await signOut(firebaseAuth);
    navigate("/account/login", { replace: true });
  };

  return (
    <Shell>
      <SEO title="My patient account" noindex />
      <main className="mx-auto min-h-[65vh] max-w-[1400px] px-5 py-10 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">
              {t("Patient account")}
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">
              {t("Hello, {name}", { name: profile?.full_name || profile?.name || "" })}
            </h1>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold">
            <FaRightFromBracket /> {t("Sign out")}
          </button>
        </div>
        <nav className="mb-7 flex flex-wrap gap-2 border-b pb-4" aria-label={t("Patient account navigation")}>
          {links.map(([href, label, Icon, end]) => (
            <NavLink
              key={href}
              to={href}
              end={end}
              className={({ isActive }) => `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${isActive ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "border hover:bg-[hsl(var(--muted))]"}`}
            >
              <Icon /> {t(label)}
            </NavLink>
          ))}
        </nav>
        <Outlet />
      </main>
    </Shell>
  );
}
