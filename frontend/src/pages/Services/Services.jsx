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
import { resolveMediaUrl } from "@/services/media";

function Services() {
  const { doctors, specialties, articles, faqs } = useCmsData();
  const [active, setActive] = useState("All");
  const filtered =
    active === "All"
      ? specialties
      : specialties.filter((s) => s.name === active);
  return (
    <Shell>
      <main>
        <PageHero
          eyebrow="How we can help"
          title={
            <>
              Care, in the shape{" "}
              <em className="text-[hsl(var(--primary))]">you</em> need it.
            </>
          }
          body="From a first conversation to specialist treatment, our teams are here to make your next step feel considered and clear."
        />
        <section className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] px-5 py-16 lg:px-8 lg:py-24">
          <div className="mb-8 flex flex-wrap gap-2">
            {["All", ...specialties.map((s) => s.name)].map((filter) => (
              <button
                key={filter}
                type="button"
                data-testid={`button-filter-service-${filter.toLowerCase().replaceAll(" ", "-")}`}
                onClick={() => setActive(filter)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold ${active === filter ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]"}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service, i) => (
              <div
                key={service.id}
                data-testid={`card-service-page-${service.id}`}
                className="group overflow-hidden rounded-[28px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
              >
                {service.image_url && (
                  <img
                    src={resolveMediaUrl(service.image_url)}
                    alt=""
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-7">
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--muted))] text-[hsl(var(--primary))]">
                      {iconFor(service.icon)}
                    </span>
                    <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">
                      0{i + 1}
                    </span>
                  </div>
                  <h2 className="mt-14 text-2xl font-bold">{service.name}</h2>
                  <p className="mt-3 leading-6 text-[hsl(var(--muted-foreground))]">
                    {service.detail}. Our multidisciplinary team brings clinical
                    expertise and a human pace to every visit.
                  </p>
                  <Link
                    to="/appointment"
                    data-testid={`link-book-service-${service.id}`}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]"
                  >
                    Book this care <FaArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div
              data-testid="empty-services"
              className="rounded-3xl border border-dashed border-[hsl(var(--border))] p-16 text-center"
            >
              No services match that search.
            </div>
          )}
        </section>
        <section className="bg-[hsl(var(--secondary)/.7)]">
          <div className="mx-auto flex max-w-[1400px] 2xl:max-w-[1600px] flex-col gap-6 px-5 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <h2 className="font-display text-4xl">Need help choosing?</h2>
              <p className="mt-2 text-sm opacity-70">
                Our care coordinators listen first, then point you in the right
                direction.
              </p>
            </div>
            <ButtonLink href="/contact" testId="link-services-coordinator">
              Speak with a coordinator <FaMessage size={17} />
            </ButtonLink>
          </div>
        </section>
      </main>
    </Shell>
  );
}

export default Services;
