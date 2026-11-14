import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Formik, Form, Field as FormikField, ErrorMessage } from "formik";
import * as Accordion from "@radix-ui/react-accordion";
import * as Yup from "yup";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBaby,
  FaBell,
  FaBone,
  FaBrain,
  FaCalendarDays,
  FaCheck,
  FaChevronDown,
  FaClock,
  FaArrowUpRightFromSquare,
  FaFacebookF,
  FaFileLines,
  FaSpa,
  FaHeartPulse,
  FaInstagram,
  FaEnvelope,
  FaLocationDot,
  FaBars,
  FaMessage,
  FaPhone,
  FaMagnifyingGlass,
  FaShieldHalved,
  FaWandMagicSparkles,
  FaStar,
  FaStethoscope,
  FaSyringe,
  FaUsers,
  FaXmark,
  FaYoutube,
} from "react-icons/fa6";
import { useCmsData } from "@/context/CmsContext";
import {
  ButtonLink,
  PageHero,
  SectionIntro,
  Field,
  InfoTile,
  imagePath,
  iconFor,
  ImageWithFallback,
} from "@/components/common";
import { Shell } from "@/components/layout";
import { DoctorCard } from "@/components/doctors";
import { useLanguage } from "@/context/LanguageContext";

function Home() {
  const { t } = useLanguage();
  const { doctors, specialties, articles, faqs } = useCmsData();
  return (
    <Shell>
      <main>
        <section className="relative overflow-hidden bg-[hsl(var(--background))]">
          <div className="absolute -right-32 top-6 h-[500px] w-[500px] rounded-full bg-[hsl(181_38%_87%/.6)] blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-[hsl(38_80%_67%/.22)] blur-2xl" />
          <div className="relative grid w-full max-w-none gap-8 px-5 pb-12 pt-12 lg:grid-cols-[1fr_.92fr] lg:items-center lg:px-12 xl:px-16 lg:pb-16 lg:pt-16">
            <div className="animate-rise">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] px-3 py-2 text-[11px] font-semibold text-[hsl(var(--primary))]">
                <span className="relative h-2 w-2 rounded-full bg-[hsl(var(--accent))] pulse-ring" />
                {t("Care that meets you where you are")}
              </div>
              <h1 className="max-w-2xl font-display text-6xl leading-[.9] tracking-[-.04em] text-[hsl(var(--foreground))] sm:text-7xl lg:text-[92px]">
                {t("The next right step in your care.")}
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-[hsl(var(--muted-foreground))]">
                {t("From a question that woke you up to a recovery plan that brings you back to yourself — P2Care helps you move forward with clarity.")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink
                  href="/appointment"
                  inverse
                  testId="link-hero-appointment"
                >
                  {t("Find your care")} <FaArrowRight size={17} />
                </ButtonLink>
                <ButtonLink href="/emergency" testId="link-hero-emergency">
                  {t("Emergency help")} <FaPhone size={16} />
                </ButtonLink>
              </div>
              <div className="mt-8 flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                <div className="flex -space-x-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[hsl(var(--background))] bg-[#d5b6a8] text-[9px] font-bold text-[#5d3f3a]">
                    PS
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[hsl(var(--background))] bg-[#b2d4cb] text-[9px] font-bold text-[#286267]">
                    RK
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[hsl(var(--background))] bg-[#d9d3aa] text-[9px] font-bold text-[#635e31]">
                    MS
                  </span>
                </div>
                <span>
                  <strong className="text-[hsl(var(--foreground))]">
                    4.9/5
                  </strong>{" "}
                  {t("from 2,400+ patient voices")}
                </span>
              </div>
            </div>
            <div className="relative min-h-[440px] lg:min-h-[550px]">
              <div className="absolute right-2 top-3 h-[390px] w-[82%] rotate-[-5deg] rounded-[48%_52%_45%_55%/48%_43%_57%_52%] bg-[hsl(var(--primary))] opacity-90 lg:h-[475px]" />
              <div className="animate-drift absolute right-0 top-9 h-[390px] w-[82%] overflow-hidden rounded-[48%_52%_45%_55%/48%_43%_57%_52%] bg-gradient-to-br from-[#d1ece5] via-[#a6ccca] to-[#6d989d] shadow-[0_30px_70px_rgba(28,82,88,.24)] lg:h-[475px]">
                <ImageWithFallback
                  src={imagePath("hero-care.jpg")}
                  alt={t("P2Care clinician speaking with a patient")}
                  className="absolute inset-0 h-full w-full object-cover opacity-75 mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary)/.5)] via-transparent to-white/10" />
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 70% 28%, rgba(255,255,255,.85), transparent 2px), radial-gradient(circle at 28% 65%, rgba(255,255,255,.4), transparent 1px)",
                    backgroundSize: "30px 30px, 42px 42px",
                  }}
                />
                <div className="absolute bottom-[-30px] left-[25%] h-[300px] w-[260px] rounded-[50%_50%_15%_15%] bg-[#e6b9a5] shadow-[inset_30px_20px_0_rgba(255,232,210,.28)] lg:h-[370px] lg:w-[310px]" />
                <div className="absolute bottom-[245px] left-[34%] h-[120px] w-[145px] rounded-[48%] bg-[#efd0b9] lg:bottom-[300px] lg:h-[155px] lg:w-[185px]" />
                <div className="absolute bottom-[250px] left-[38%] h-8 w-24 rounded-full bg-[#2e5157] lg:bottom-[315px] lg:h-10 lg:w-32" />
                <div className="absolute bottom-[120px] left-[38%] h-36 w-10 rounded-full bg-[#f3d6bf] shadow-[90px_-20px_0_#f3d6bf] lg:bottom-[150px] lg:h-48 lg:w-12 lg:shadow-[115px_-25px_0_#f3d6bf]" />
                <div className="absolute right-[10%] top-[17%] rounded-full bg-[hsl(var(--card)/.84)] px-4 py-3 text-xs font-semibold text-[hsl(var(--primary))] shadow-lg">
                  {t("Here when you need us")}{" "}
                  <FaHeartPulse size={15} className="ml-1 inline" />
                </div>
              </div>
              <div className="absolute bottom-6 left-0 glass rounded-3xl p-4 sm:left-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]">
                    <FaShieldHalved size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-bold">{t("Clinically credible")}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {t("Human at every touchpoint")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-y border-[hsl(var(--border)/.75)] bg-[hsl(var(--card)/.6)]">
          <div className="mx-auto grid max-w-[1400px] 2xl:max-w-[1600px] grid-cols-2 divide-x divide-[hsl(var(--border))] px-5 py-7 sm:grid-cols-4 lg:px-8">
            {[
              ["400+", "doctors"],
              ["50+", "specialties"],
              ["2L+", "patients cared for"],
              ["24/7", "emergency care"],
            ].map(([value, label]) => (
              <div
                key={label}
                data-testid={`stat-${label.replaceAll(" ", "-")}`}
                className="px-3 text-center first:pl-0 last:pr-0 sm:px-5"
              >
                <strong className="font-display text-3xl text-[hsl(var(--primary))] sm:text-4xl">
                  {value}
                </strong>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">
                  {t(label)}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="w-full max-w-none px-5 py-20 lg:px-8 lg:py-28 2xl:px-12">
          <SectionIntro
            eyebrow="Start here"
            title="Care feels clearer when someone walks beside you."
            action={
              <Link
                to="/services"
                data-testid="link-view-all-services"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]"
              >
                {t("View all services")}{" "}
                <FaArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            }
          >
            <span>
              {t("One good next step can change the whole day. Explore the ways our teams can help, from first questions to specialist care.")}
            </span>
          </SectionIntro>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {specialties.map((service, i) => (
              <Link
                key={service.id}
                to="/services"
                data-testid={`card-service-${service.id}`}
                className={`group relative overflow-hidden rounded-[26px] border border-[hsl(var(--border))] p-6 ${i === 0 ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "bg-[hsl(var(--card))]"} hover:-translate-y-1 hover:shadow-[var(--shadow-card)]`}
              >
                <div className="mb-16 flex items-start justify-between">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-2xl ${i === 0 ? "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]" : "bg-[hsl(var(--muted))] text-[hsl(var(--primary))]"}`}
                  >
                    {iconFor(service.icon)}
                  </span>
                  <FaArrowRight
                    size={18}
                    className="opacity-50 transition-transform group-hover:translate-x-1"
                  />
                </div>
                <h3 className="text-xl font-bold">{t(service.name)}</h3>
                <p
                  className={`mt-2 text-sm ${i === 0 ? "text-[hsl(var(--primary-foreground)/.72)]" : "text-[hsl(var(--muted-foreground))]"}`}
                >
                  {t(service.detail)}
                </p>
                {i === 0 && (
                  <span className="absolute -bottom-8 -right-3 text-[100px] font-display leading-none text-[hsl(var(--secondary)/.22)]">
                    01
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] px-5 py-20 lg:px-8 lg:py-28">
          <SectionIntro
            eyebrow="People you can trust"
            title="Meet the team behind the calm."
            action={
              <ButtonLink href="/doctors" testId="link-meet-doctors">
                {t("Meet all doctors")} <FaArrowRight size={16} />
              </ButtonLink>
            }
          >
            <span>
              {t("More than credentials. Find a clinician whose approach feels right for you and your family.")}
            </span>
          </SectionIntro>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.slice(0, 4).map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </section>
        <section className="bg-[hsl(181_37%_90%/.55)]">
          <div className="mx-auto grid max-w-[1400px] 2xl:max-w-[1600px] gap-12 px-5 py-20 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:px-8 lg:py-28">
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">
                {t("The P2Care promise")}
              </p>
              <h2 className="font-display text-5xl leading-[.96] tracking-[-.03em]">
                {t("Good care is also good company.")}
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">
                {t("We partner with Shalby Hospital to make the spaces between appointments feel less uncertain — with clear information, thoughtful people and a plan you can trust.")}
              </p>
              <ButtonLink
                href="/hospital"
                testId="link-promise-hospital"
                inverse
              >
                {t("Meet your hospital")} <FaArrowRight size={16} />
              </ButtonLink>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[26px] bg-[hsl(var(--card))] p-6 sm:translate-y-8">
                <span className="font-mono text-xs text-[hsl(var(--accent))]">
                  {t("01 / LISTEN FIRST")}
                </span>
                <h3 className="mt-12 text-lg font-bold">
                  {t("No rushing the first question.")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {t("Our teams make room for the context behind the symptom.")}
                </p>
              </div>
              <div className="rounded-[26px] bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))]">
                <span className="font-mono text-xs text-[hsl(var(--secondary))]">
                  {t("02 / JOIN THE DOTS")}
                </span>
                <h3 className="mt-12 text-lg font-bold">
                  {t("One connected care journey.")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[hsl(var(--primary-foreground)/.72)]">
                  {t("Your notes, people and next steps stay connected.")}
                </p>
              </div>
              <div className="rounded-[26px] bg-[hsl(var(--secondary))] p-6 text-[hsl(var(--foreground))] sm:col-span-2">
                <span className="font-mono text-xs">{t("03 / STAY CLOSE")}</span>
                <div className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                  <h3 className="max-w-md text-2xl font-bold leading-tight">
                    {t("Care doesn’t end when you leave the hospital.")}
                  </h3>
                  <p className="max-w-xs text-sm leading-6 opacity-70">
                    {t("Follow-up support that meets you at home, too.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] px-5 pb-20 lg:px-8 lg:pb-28">
          <div className="grid-paper overflow-hidden rounded-[34px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-7 sm:p-10 lg:grid-cols-[1fr_.8fr] lg:p-14">
            <div>
              <span className="inline-flex rounded-full bg-[hsl(var(--secondary)/.7)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest">
                {t("P2Care journal")}
              </span>
              <h2 className="mt-6 max-w-xl font-display text-5xl leading-[.95] tracking-[-.03em]">
                {t("A little more context can change everything.")}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                {t("Clear, practical health stories from the people who care for our community.")}
              </p>
              <Link
                to="/articles"
                data-testid="link-home-articles"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]"
              >
                {t("Read the journal")} <FaArrowRight size={17} />
              </Link>
            </div>
            <div className="mt-10 grid gap-3 lg:mt-0">
              {articles.slice(0, 2).map((article, i) => (
                <Link
                  to="/articles"
                  key={article.id}
                  data-testid={`card-home-article-${article.id}`}
                  className="group flex gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.55)] p-3 hover:bg-[hsl(var(--background))]"
                >
                  <div
                    className={`h-24 w-24 shrink-0 rounded-xl bg-gradient-to-br ${article.tone}`}
                  >
                    <span className="block p-3 font-mono text-[10px] text-[hsl(var(--primary))]">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="py-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
                      {t(article.category)}
                    </span>
                    <h3 className="mt-1 font-semibold leading-5 group-hover:text-[hsl(var(--primary))]">
                      {t(article.title)}
                    </h3>
                    <span className="mt-2 block text-xs text-[hsl(var(--muted-foreground))]">
                      {t(article.read)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-[hsl(var(--secondary))]">
          <div className="flex w-full max-w-none flex-col gap-8 px-5 py-14 md:flex-row md:items-center md:justify-between lg:px-8 2xl:px-12">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] opacity-65">
                {t("Not sure where to begin?")}
              </p>
              <h2 className="mt-2 font-display text-4xl leading-none">
                {t("Let’s find the right door.")}
              </h2>
            </div>
            <ButtonLink href="/contact" testId="link-home-contact">
              {t("Talk to a care coordinator")} <FaArrowRight size={16} />
            </ButtonLink>
          </div>
        </section>
      </main>
    </Shell>
  );
}

export default Home;
