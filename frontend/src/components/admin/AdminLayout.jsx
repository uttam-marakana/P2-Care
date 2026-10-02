import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaGaugeHigh,
  FaCalendarDays,
  FaStethoscope,
  FaHeartPulse,
  FaFileLines,
  FaCircleQuestion,
  FaImages,
  FaBell,
  FaShieldHalved,
  FaRightFromBracket,
  FaBars,
  FaXmark,
} from "react-icons/fa6";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { isMockMode } from "@/lib/adminMode";
import { mockSignOut } from "@/services/mockAdmin";

const links = [
  ["/admin", "Dashboard", FaGaugeHigh],
  ["/admin/appointments", "Appointments", FaCalendarDays],
  ["/admin/doctors", "Doctors", FaStethoscope],
  ["/admin/services", "Services", FaHeartPulse],
  ["/admin/articles", "Articles", FaFileLines],
  ["/admin/faqs", "FAQs", FaCircleQuestion],
  ["/admin/media", "Media", FaImages],
  ["/admin/communications", "Communications", FaBell],
  ["/admin/security", "Security", FaShieldHalved],
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logout = async () => {
    if (isMockMode) mockSignOut();
    else if (firebaseAuth) await signOut(firebaseAuth);
    navigate("/admin/login", { replace: true });
  };
  return (
    <div className="min-h-screen bg-[hsl(var(--muted)/.35)]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r bg-[hsl(var(--card))] p-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <strong className="text-xl">P2Care</strong>
            <p className="text-xs text-muted-foreground">Admin console</p>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <FaXmark />
          </button>
        </div>
        <nav className="grid gap-1">
          {links.map(([to, label, Icon]) => (
            <NavLink
              end={to === "/admin"}
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "hover:bg-[hsl(var(--muted))]"}`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-8 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-[hsl(var(--muted))]"
        >
          <FaRightFromBracket size={17} />
          Sign out
        </button>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-[hsl(var(--background)/.9)] px-5 backdrop-blur">
          <button className="mr-4 lg:hidden" onClick={() => setOpen(true)}>
            <FaBars />
          </button>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">
              P2Care Hospital
            </p>
            <h1 className="text-sm font-bold">Management Console</h1>
          </div>
        </header>
        {isMockMode && (
          <div className="border-b border-amber-300 bg-amber-50 px-5 py-2 text-xs font-medium text-amber-900 lg:px-8">
            Development / mock-data mode — changes are stored only in this
            browser. Firebase is used for authentication and data when mock mode
            is disabled.
          </div>
        )}
        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
