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

function Hospital() {
  const { doctors, specialties, articles, faqs } = useCmsData();
  return (
    <Shell>
      <main>
        <PageHero
          eyebrow="Your visit"
          title={
            <>
              A hospital designed around{" "}
              <em className="text-[hsl(var(--primary))]">people.</em>
            </>
          }
          body="P2Care partners with Shalby Hospital Mohali at Silver Oaks Hospital — bringing specialist expertise and a softer way through it all."
          accent
        />
        <section className="mx-auto grid max-w-[1400px] 2xl:max-w-[1600px] gap-12 px-5 py-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">
              Find your bearings
            </p>
            <h2 className="mt-4 font-display text-5xl leading-none">
              Everything you need, without the maze.
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">
              From the front door to follow-up, our teams are connected around
              your care. We’ll help you know where to go, what to bring and what
              happens next.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <InfoTile
                icon={<FaLocationDot />}
                title="Our address"
                text="Silver Oaks Hospital, Phase-IFaXmark, Sector-63, SAS Nagar, Mohali, Punjab 160062"
              />
              <InfoTile
                icon={<FaPhone />}
                title="Patient helpline"
                text="+91 1800 123 4567, available 24/7"
              />
              <InfoTile
                icon={<FaShieldHalved />}
                title="For every patient"
                text="Accessible entrances, interpreters and family-friendly support."
              />
              <InfoTile
                icon={<FaCalendarDays />}
                title="Before you arrive"
                text="Bring your ID, reports, prescriptions and insurance details."
              />
            </div>
          </div>
          <div className="grid-paper relative min-h-[440px] overflow-hidden rounded-[36px] border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-7">
            <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-[hsl(var(--secondary)/.65)] blur-2xl" />
            <div className="absolute bottom-10 right-8 h-56 w-56 rounded-full bg-[hsl(var(--primary)/.14)] blur-2xl" />
            <div className="relative flex h-full flex-col justify-between">
              <span className="font-mono text-xs text-[hsl(var(--primary))]">
                CAMPUS / 01
              </span>
              <div className="my-10 flex-1">
                <div className="mx-auto max-w-sm rounded-[28px] border-2 border-[hsl(var(--primary)/.45)] bg-[hsl(var(--card)/.55)] p-5 shadow-[var(--shadow-soft)]">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold">
                      Silver Oaks Hospital
                    </span>
                    <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-1 font-mono text-[9px]">
                      MOHALI
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="h-20 rounded-lg bg-[hsl(var(--primary)/.15)]" />
                    <span className="h-20 rounded-lg bg-[hsl(var(--accent)/.23)]" />
                    <span className="h-20 rounded-lg bg-[hsl(var(--primary)/.22)]" />
                  </div>
                  <div className="mt-3 h-2 w-2/3 rounded bg-[hsl(var(--primary)/.2)]" />
                  <div className="mt-2 h-2 w-1/2 rounded bg-[hsl(var(--primary)/.12)]" />
                </div>
              </div>
              <span className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))]">
                <FaLocationDot size={16} /> Phase-IFaXmark · Sector-63
              </span>
            </div>
          </div>
        </section>
        <section className="bg-[hsl(var(--muted)/.55)]">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] px-5 py-16 lg:px-8 lg:py-20">
            <SectionIntro
              eyebrow="A gentler arrival"
              title="What your first visit can feel like."
            />
            <div className="grid gap-3 md:grid-cols-4">
              {[
                [
                  "01",
                  "Arrive",
                  "Accessible parking and a welcome desk at the main entrance.",
                ],
                [
                  "02",
                  "Orient",
                  "A coordinator helps you find your clinic and settle in.",
                ],
                [
                  "03",
                  "Meet",
                  "Your doctor takes time to understand the full picture.",
                ],
                [
                  "04",
                  "Leave clear",
                  "You go home with a plan, not a list of loose ends.",
                ],
              ].map(([n, t, d]) => (
                <div
                  key={n}
                  className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5"
                >
                  <span className="font-mono text-xs text-[hsl(var(--accent))]">
                    {n}
                  </span>
                  <h3 className="mt-10 font-bold">{t}</h3>
                  <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                    {d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}

export default Hospital;
