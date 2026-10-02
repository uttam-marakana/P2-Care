import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight, FaBars, FaMessage, FaXmark } from "react-icons/fa6";
import ButtonLink from "../common/ButtonLink";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation().pathname;
  const links = [['Services', '/services'], ['Doctors', '/doctors'], ['Your visit', '/hospital'], ['Stories', '/articles'], ['FAQs', '/faq']];
  return (
    <>
      <div className="bg-[hsl(var(--primary))] px-5 py-2 text-center text-xs font-medium tracking-wide text-[hsl(var(--primary-foreground))]">
        <span className="hidden sm:inline">24/7 patient helpline</span> <a href="tel:+9118001234567" data-testid="link-helpline-top" className="ml-1 font-mono text-[hsl(var(--secondary))]">+91 1800 123 4567</a>
        <span className="mx-2 opacity-40">·</span> <span>Emergency care always open</span>
      </div>
      <header className="relative z-40 border-b border-[hsl(var(--border)/.72)] bg-[hsl(var(--background)/.86)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] 2xl:max-w-[1600px] items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" data-testid="link-logo" className="group flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-[14px] bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] shadow-[0_8px_20px_rgba(20,87,91,.18)]">
              <span className="absolute h-4 w-[2px] rounded bg-current" /><span className="absolute h-[2px] w-4 rounded bg-current" />
            </span>
            <span><strong className="block text-[17px] tracking-[-.03em]">P2Care</strong><small className="block text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Hospital Mohali</small></span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {links.map(([label, href]) => <Link key={href} to={href} data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`} className={`text-sm ${location === href || (href === '/doctors' && location.startsWith('/doctors/')) ? 'font-semibold text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}>{label}</Link>)}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <ButtonLink href="/contact" testId="link-contact-header">Talk to us <FaMessage size={16} /></ButtonLink>
            <ButtonLink href="/appointment" inverse testId="link-appointment-header">Book appointment <FaArrowRight size={16} /></ButtonLink>
          </div>
          <button type="button" aria-label="Toggle menu" aria-expanded={mobileOpen} data-testid="button-mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} className="grid h-11 w-11 place-items-center rounded-full border border-[hsl(var(--border))] lg:hidden">{mobileOpen ? <FaXmark size={20} /> : <FaBars size={20} />}</button>
        </div>
        {mobileOpen && <div className="border-t border-[hsl(var(--border)/.75)] bg-[hsl(var(--card))] px-5 pb-5 pt-3 lg:hidden">
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {links.map(([label, href]) => <Link key={href} to={href} onClick={() => setMobileOpen(false)} data-testid={`link-mobile-${label.toLowerCase().replace(' ', '-')}`} className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-[hsl(var(--muted))]">{label}</Link>)}
            <div className="mt-3 grid grid-cols-2 gap-2"><ButtonLink href="/contact" testId="link-mobile-contact">Talk to us</ButtonLink><ButtonLink href="/appointment" inverse testId="link-mobile-appointment">Book visit</ButtonLink></div>
          </nav>
        </div>}
      </header>
    </>
  );
}

export default Header;
