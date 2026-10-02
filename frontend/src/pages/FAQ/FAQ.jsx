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

function FAQ() {
  const { doctors, specialties, articles, faqs } = useCmsData();
  const [query, setQuery] = useState("");
  const filtered = faqs.filter((f) =>
    `${f.q} ${f.a}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Shell>
      <main>
        <PageHero
          eyebrow="Questions, answered"
          title={
            <>
              Clarity is part of{" "}
              <em className="text-[hsl(var(--primary))]">care.</em>
            </>
          }
          body="Straight answers to the practical things patients and families ask us most."
        />
        <section className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] px-5 py-14 lg:px-8 lg:py-20">
          <div className="mb-8 flex items-center gap-3 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-1">
            <FaMagnifyingGlass
              size={17}
              className="text-[hsl(var(--muted-foreground))]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-testid="input-faq-search"
              placeholder="FaMagnifyingGlass FAQs"
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </div>
          <Accordion.Root
            type="single"
            collapsible
            defaultValue={filtered.length ? "faq-0" : undefined}
            className="rounded-[28px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5"
          >
            {filtered.map((faq, i) => (
              <Accordion.Item
                key={faq.q}
                value={`faq-${i}`}
                className="border-b border-[hsl(var(--border))] last:border-b-0"
              >
                <Accordion.Header>
                  <Accordion.Trigger
                    data-testid={`button-faq-${i}`}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left text-base font-bold"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-[hsl(var(--primary))] transition-transform group-data-[state=open]:rotate-180"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content
                  data-testid={`text-faq-answer-${i}`}
                  className="max-w-2xl overflow-hidden pb-6 text-sm leading-7 text-[hsl(var(--muted-foreground))] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                >
                  {faq.a}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
          {!filtered.length && (
            <div
              data-testid="empty-faq"
              className="py-16 text-center text-sm text-[hsl(var(--muted-foreground))]"
            >
              No answer found.{" "}
              <Link
                to="/contact"
                data-testid="link-faq-contact"
                className="font-bold text-[hsl(var(--primary))]"
              >
                Ask our care team.
              </Link>
            </div>
          )}
          <div className="mt-8 flex flex-col gap-5 rounded-[28px] bg-[hsl(var(--secondary))] p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl">Still wondering?</h2>
              <p className="mt-1 text-sm opacity-70">
                We’re happy to talk it through.
              </p>
            </div>
            <ButtonLink href="/contact" testId="link-faq-talk">
              Talk to us <FaMessage size={16} />
            </ButtonLink>
          </div>
        </section>
      </main>
    </Shell>
  );
}

export default FAQ;
