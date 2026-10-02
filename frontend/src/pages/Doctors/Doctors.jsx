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

function DoctorsPage() {
  const { doctors, specialties, articles, faqs } = useCmsData();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const filtered = useMemo(
    () =>
      doctors.filter(
        (d) =>
          (specialty === "All specialties" || d.specialty === specialty) &&
          `${d.name} ${d.specialty}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, specialty],
  );
  return (
    <Shell>
      <main>
        <PageHero
          eyebrow="Your care team"
          title={
            <>
              The right expertise,{" "}
              <em className="text-[hsl(var(--primary))]">closer</em> to home.
            </>
          }
          body="Meet the doctors who make complex care feel understandable. Browse by specialty, approach and availability."
        />
        <section className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] px-5 py-14 lg:px-8 lg:py-20">
          <div className="mb-10 flex flex-col gap-3 rounded-[28px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 md:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-2xl bg-[hsl(var(--muted)/.65)] px-4">
              <FaMagnifyingGlass
                size={18}
                className="text-[hsl(var(--muted-foreground))]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="input-doctor-search"
                placeholder="FaMagnifyingGlass a doctor or specialty"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </label>
            <label className="relative flex items-center rounded-2xl bg-[hsl(var(--muted)/.65)] px-4">
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                data-testid="select-doctor-specialty"
                className="w-full appearance-none bg-transparent py-3 pr-7 text-sm font-medium outline-none"
              >
                <option>All specialties</option>
                {specialties.map((s) => (
                  <option key={s.id}>{s.name}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 text-[hsl(var(--muted-foreground))]"
              />
            </label>
          </div>
          <div className="mb-6 flex items-center justify-between">
            <p
              data-testid="text-doctor-result-count"
              className="text-sm text-[hsl(var(--muted-foreground))]"
            >
              {filtered.length} care professionals
            </p>
            <span className="hidden items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] sm:flex">
              <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
              Showing sample profiles
            </span>
          </div>
          {filtered.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div
              data-testid="empty-doctors"
              className="grid place-items-center rounded-[28px] border border-dashed border-[hsl(var(--border))] px-8 py-20 text-center"
            >
              <FaMagnifyingGlass
                size={28}
                className="mb-4 text-[hsl(var(--primary))]"
              />
              <h2 className="font-display text-3xl">
                No one by that name, yet.
              </h2>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                Try another specialty or talk to our care desk.
              </p>
              <ButtonLink href="/contact" testId="link-empty-doctors-contact">
                Talk to care desk
              </ButtonLink>
            </div>
          )}
        </section>
      </main>
    </Shell>
  );
}

export default DoctorsPage;
