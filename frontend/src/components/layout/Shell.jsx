import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa6";
import Header from "./Header";
import Footer from "./Footer";

function Shell({ children }) {
  return <div className="min-h-[100dvh]"><Header /><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>{children}</motion.div><Footer /><a href="tel:+9118001234567" data-testid="link-floating-emergency" className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-4 py-3 text-xs font-bold text-[hsl(var(--foreground))] shadow-[0_10px_30px_rgba(185,92,76,.25)] hover:-translate-y-1"><FaPhone size={15} /> <span className="hidden sm:inline">Need help now?</span></a></div>;
}

export default Shell;
