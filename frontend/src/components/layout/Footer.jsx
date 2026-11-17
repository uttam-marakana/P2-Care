import { subscribeNewsletter } from "@/services/cms";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../public/logo.png";
import LanguageSelect from "./LanguageSelect";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { policyLinks } from "@/pages/Policies/Policies";
import {
  FaArrowRight,
  FaCheck,
  FaChevronDown,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";

function Footer() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [openMenus, setOpenMenus] = useState({
    care: false,
    p2care: false,
    policies: false,
  });
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  const toggleMenu = (menu) => {
    setOpenMenus((current) => ({ ...current, [menu]: !current[menu] }));
  };

  return (
    <footer className="bg-[hsl(202_42%_15%)] text-[hsl(190_35%_91%)]">
      <div className="mx-auto grid max-w-[1400px] 2xl:max-w-[1600px] gap-5 px-5 py-8 sm:grid-cols-2 sm:gap-7 sm:px-6 sm:py-10 lg:grid-cols-[1.05fr_.65fr_.75fr_.85fr_1.15fr] lg:gap-8 lg:px-8 lg:py-16">
        <div>
          <Link
            to="/"
            data-testid="link-footer-logo"
            className="mb-5 inline-flex rounded-xl bg-white px-3 py-2"
          >
            <img
              src={logo}
              alt="P2Care Hospital"
              className="h-10 w-40 object-contain"
            />
          </Link>
          <p className="max-w-xs text-sm leading-6 text-[hsl(193_20%_70%)]">
            {t("A trusted care companion for patients and families.")}
          </p>
          <div className="mt-6 flex gap-2">
            <a
              href="#"
              aria-label="Facebook"
              data-testid="link-social-facebook"
              className="rounded-full border border-[hsl(190_25%_30%)] p-2.5 hover:bg-[hsl(190_25%_25%)]"
            >
              <FaFacebookF size={15} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              data-testid="link-social-instagram"
              className="rounded-full border border-[hsl(190_25%_30%)] p-2.5 hover:bg-[hsl(190_25%_25%)]"
            >
              <FaInstagram size={15} />
            </a>
            <a
              href="#"
              aria-label="Youtube"
              data-testid="link-social-youtube"
              className="rounded-full border border-[hsl(190_25%_30%)] p-2.5 hover:bg-[hsl(190_25%_25%)]"
            >
              <FaYoutube size={15} />
            </a>
          </div>
        </div>
        <div className="border-b border-[hsl(190_25%_27%)] pb-4 sm:border-0 sm:pb-0">
          <h3 className="mb-4 hidden text-xs font-bold uppercase tracking-[.18em] text-[hsl(var(--secondary))] sm:block">
            {t("Find care")}
          </h3>
          <button
            type="button"
            aria-expanded={openMenus.care}
            aria-controls="footer-find-care-links"
            data-testid="button-footer-find-care"
            onClick={() => toggleMenu("care")}
            className="flex w-full items-center justify-between py-2 text-left text-xs font-bold uppercase tracking-[.18em] text-[hsl(var(--secondary))] sm:hidden"
          >
            {t("Find care")}
            <FaChevronDown
              aria-hidden="true"
              className={`transition-transform ${openMenus.care ? "rotate-180" : ""}`}
            />
          </button>
          <div
            id="footer-find-care-links"
            className={`${openMenus.care ? "grid" : "hidden"} gap-3 pt-2 text-sm text-[hsl(193_20%_75%)] sm:grid sm:pt-0`}
          >
            <Link to="/services" data-testid="link-footer-services">
              {t("Our services")}
            </Link>
            <Link to="/doctors" data-testid="link-footer-doctors">
              {t("Find a doctor")}
            </Link>
            <Link to="/appointment" data-testid="link-footer-appointment">
              {t("Book an appointment")}
            </Link>
            <Link to="/emergency" data-testid="link-footer-emergency">
              {t("Emergency care")}
            </Link>
          </div>
        </div>
        <div className="border-b border-[hsl(190_25%_27%)] pb-4 sm:border-0 sm:pb-0">
          <h3 className="mb-4 hidden text-xs font-bold uppercase tracking-[.18em] text-[hsl(var(--secondary))] sm:block">
            {t("P2Care")}
          </h3>
          <button
            type="button"
            aria-expanded={openMenus.p2care}
            aria-controls="footer-p2care-links"
            data-testid="button-footer-p2care"
            onClick={() => toggleMenu("p2care")}
            className="flex w-full items-center justify-between py-2 text-left text-xs font-bold uppercase tracking-[.18em] text-[hsl(var(--secondary))] sm:hidden"
          >
            {t("P2Care")}
            <FaChevronDown
              aria-hidden="true"
              className={`transition-transform ${openMenus.p2care ? "rotate-180" : ""}`}
            />
          </button>
          <div
            id="footer-p2care-links"
            className={`${openMenus.p2care ? "grid" : "hidden"} gap-3 pt-2 text-sm text-[hsl(193_20%_75%)] sm:grid sm:pt-0`}
          >
            <Link to="/hospital" data-testid="link-footer-hospital">
              {t("About the hospital")}
            </Link>
            <Link to="/articles" data-testid="link-footer-articles">
              {t("Health stories")}
            </Link>
            <Link to="/contact" data-testid="link-footer-contact">
              {t("Contact & directions")}
            </Link>
            <Link to="/faq" data-testid="link-footer-faq">
              {t("Patient FAQs")}
            </Link>
            <Link
              to={profile?.role === "patient" ? "/account" : "/account/login"}
              data-testid="link-footer-patient-account"
            >
              {profile?.role === "patient" ? t("My account") : t("Patient sign in")}
            </Link>
          </div>
        </div>
        <div className="border-b border-[hsl(190_25%_27%)] pb-4 sm:border-0 sm:pb-0">
          <h3 className="mb-4 hidden text-xs font-bold uppercase tracking-[.18em] text-[hsl(var(--secondary))] sm:block">
            {t("Policies")}
          </h3>
          <button
            type="button"
            aria-expanded={openMenus.policies}
            aria-controls="footer-policy-links"
            data-testid="button-footer-policies"
            onClick={() => toggleMenu("policies")}
            className="flex w-full items-center justify-between py-2 text-left text-xs font-bold uppercase tracking-[.18em] text-[hsl(var(--secondary))] sm:hidden"
          >
            {t("Policies")}
            <FaChevronDown
              aria-hidden="true"
              className={`transition-transform ${openMenus.policies ? "rotate-180" : ""}`}
            />
          </button>
          <nav
            id="footer-policy-links"
            aria-label={t("Hospital policies")}
            className={`${openMenus.policies ? "grid" : "hidden"} gap-3 pt-2 text-sm text-[hsl(193_20%_75%)] sm:grid sm:pt-0`}
          >
            {policyLinks.map(({ slug, label }) => (
              <Link
                key={slug}
                to={`/policies/${slug}`}
                data-testid={`link-footer-policy-${slug}`}
              >
                {t(label)}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[hsl(var(--secondary))]">
            {t("A little care, delivered")}
          </h3>
          <p className="mb-4 text-sm leading-6 text-[hsl(193_20%_75%)]">
            {t("Monthly notes on staying well, written by our care team.")}
          </p>
          {sent ? (
            <div
              data-testid="status-newsletter-success"
              className="rounded-2xl bg-[hsl(190_25%_23%)] p-4 text-sm text-[hsl(var(--secondary))]"
            >
              <FaCheck size={16} className="mb-2" />
              {t("You’re on the list. See you soon.")}
            </div>
          ) : (
            <form
              className="flex rounded-full border border-[hsl(190_25%_30%)] p-1"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email) return;
                setNewsletterError("");
                try {
                  await subscribeNewsletter(email);
                  setSent(true);
                } catch (error) {
                  setNewsletterError(
                    error.message || t("Unable to subscribe right now."),
                  );
                }
              }}
            >
              <input
                aria-label={t("Email for newsletter")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-newsletter-email"
                type="email"
                required
                placeholder={t("Your email")}
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[hsl(193_20%_56%)]"
              />
              <button
                data-testid="button-newsletter-submit"
                type="submit"
                className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]"
              >
                <FaArrowRight size={16} />
              </button>
            </form>
          )}
          {newsletterError && (
            <p className="mt-2 px-3 text-xs text-red-200">{newsletterError}</p>
          )}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] 2xl:max-w-[1600px] flex-col gap-2 border-t border-[hsl(190_25%_27%)] px-5 py-4 text-xs text-[hsl(193_20%_58%)] sm:flex-row sm:justify-between sm:px-6 sm:py-4 lg:px-8 lg:py-5">
        <span>{t("© 2024 P2Care Hospital · In partnership with Shalby Hospital")}</span>
        <span>{t("Privacy · Accessibility · Patient-first, always.")}</span>
        <LanguageSelect
          className="text-[hsl(193_20%_75%)]"
          testId="select-language-footer"
        />
      </div>
    </footer>
  );
}

export default Footer;
