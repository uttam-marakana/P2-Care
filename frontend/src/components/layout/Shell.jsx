import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import Header from "./Header";
import Footer from "./Footer";
import { buildWhatsAppUrl, generalWhatsAppMessage } from "@/lib/whatsapp";
import { useLanguage } from "@/context/LanguageContext";

function Shell({ children }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-[100dvh]">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
      <Footer />
      <div className="fixed bottom-5 right-5 z-30">
        <a
          href={buildWhatsAppUrl(generalWhatsAppMessage())}
          target="_blank"
          rel="noreferrer"
          aria-label={t("Chat with P2Care on WhatsApp")}
          data-testid="link-floating-whatsapp"
          className="group flex min-h-12 items-center gap-2.5 rounded-full border border-[#138b57] bg-[#168c5b] px-4 text-sm font-bold text-white shadow-[0_8px_24px_rgba(20,50,54,.22)] hover:-translate-y-0.5 hover:bg-[#11794e] focus-visible:outline-white"
        >
          <FaWhatsapp aria-hidden="true" size={23} />
          <span className="hidden sm:inline">{t("Chat with us")}</span>
          <span className="hidden h-2 w-2 rounded-full bg-[#a8f0c8] sm:block" />
        </a>
      </div>
    </div>
  );
}

export default Shell;
