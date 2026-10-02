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

const emergencySchema = Yup.object({
  phone: Yup.string()
    .trim()
    .matches(/^[+0-9 ()-]{8,18}$/, "Enter a valid mobile number.")
    .required("Mobile number is required."),
});

function Emergency() {
  const { doctors, specialties, articles, faqs } = useCmsData();
  const [callback, setCallback] = useState(false);
  const [phone, setFaPhone] = useState("");

  return (
    <Shell>
      <main>
        <section className="bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]">
          <div className="mx-auto grid max-w-[1400px] 2xl:max-w-[1600px] gap-10 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--foreground)/.1)] px-3 py-2 font-mono text-[10px] uppercase tracking-[.2em]">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--secondary))]" />
                Open 24 hours
              </span>
              <h1 className="mt-6 max-w-2xl font-display text-7xl leading-[.86] tracking-[-.04em]">
                You don’t have to figure this out alone.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 opacity-75">
                In a medical emergency, call our patient helpline now. Our team
                will help you take the safest next step.
              </p>
              <a
                href="tel:+9118001234567"
                data-testid="link-emergency-call-hero"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[hsl(var(--foreground))] px-6 py-4 text-base font-bold text-[hsl(var(--accent))] hover:-translate-y-1"
              >
                <FaPhone size={19} /> Call +91 1800 123 4567
              </a>
            </div>
            <div className="relative mx-auto flex min-h-[270px] w-full max-w-md items-center justify-center">
              <div className="pulse-ring relative grid h-36 w-36 place-items-center rounded-full border border-[hsl(var(--foreground)/.3)] bg-[hsl(var(--foreground)/.12)]">
                <FaPhone size={42} />
              </div>
              <div className="absolute left-4 top-6 rounded-2xl bg-[hsl(var(--card)/.82)] p-4 text-sm font-semibold shadow-lg backdrop-blur-sm">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--primary))]">
                  Response
                </span>
                <span className="mt-1 block">A human, right away.</span>
              </div>
              <div className="absolute bottom-2 right-4 rounded-2xl bg-[hsl(var(--secondary))] p-4 text-sm font-semibold shadow-lg">
                <span className="block font-mono text-[10px] uppercase tracking-widest opacity-60">
                  Mohali
                </span>
                <span className="mt-1 block">Shalby Hospital</span>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-[1000px] gap-5 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="rounded-[30px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-7">
            <FaSyringe size={22} className="text-[hsl(var(--primary))]" />
            <h2 className="mt-12 font-display text-4xl">When to call now</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              <li className="flex gap-3">
                <FaCheck
                  size={17}
                  className="mt-1 shrink-0 text-[hsl(var(--accent))]"
                />
                Chest pain, difficulty breathing or sudden weakness
              </li>
              <li className="flex gap-3">
                <FaCheck
                  size={17}
                  className="mt-1 shrink-0 text-[hsl(var(--accent))]"
                />
                Serious injury, uncontrolled bleeding or loss of consciousness
              </li>
              <li className="flex gap-3">
                <FaCheck
                  size={17}
                  className="mt-1 shrink-0 text-[hsl(var(--accent))]"
                />
                Any symptom that feels life-threatening or rapidly worsening
              </li>
            </ul>
            <p className="mt-6 rounded-2xl bg-[hsl(var(--muted))] p-4 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
              <strong className="text-[hsl(var(--foreground))]">
                If someone is in immediate danger,
              </strong>{" "}
              call your local emergency services first.
            </p>
          </div>
          <div className="rounded-[30px] bg-[hsl(var(--primary))] p-7 text-[hsl(var(--primary-foreground))]">
            {callback ? (
              <div data-testid="status-callback-success">
                <FaCheck size={22} className="text-[hsl(var(--secondary))]" />
                <h2 className="mt-12 font-display text-4xl">
                  We’re calling you back.
                </h2>
                <p className="mt-4 text-sm leading-6 text-[hsl(var(--primary-foreground)/.7)]">
                  A care coordinator will reach you at {phone} as soon as
                  possible.
                </p>
              </div>
            ) : (
              <>
                <FaMessage size={22} className="text-[hsl(var(--secondary))]" />
                <h2 className="mt-12 font-display text-4xl">
                  Prefer a callback?
                </h2>
                <p className="mt-3 text-sm leading-6 text-[hsl(var(--primary-foreground)/.7)]">
                  Share your number and our emergency desk will call you back.
                  If it’s urgent, please call directly.
                </p>
                <Formik
                  initialValues={{ phone: "" }}
                  validationSchema={emergencySchema}
                  onSubmit={(values) => {
                    setFaPhone(values.phone);
                    setCallback(true);
                  }}
                >
                  <Form className="mt-7">
                    <div className="flex gap-2">
                      <FormikField
                        name="phone"
                        type="tel"
                        data-testid="input-emergency-phone"
                        placeholder="+91 mobile number"
                        className="min-w-0 flex-1 rounded-full bg-[hsl(var(--primary-foreground)/.12)] px-4 py-3 text-sm outline-none placeholder:text-[hsl(var(--primary-foreground)/.55)]"
                      />
                      <button
                        type="submit"
                        data-testid="button-emergency-callback"
                        className="rounded-full bg-[hsl(var(--secondary))] px-4 py-3 text-sm font-bold text-[hsl(var(--foreground))]"
                      >
                        Call me
                      </button>
                    </div>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="mt-2 text-xs text-[hsl(var(--secondary))]"
                    />
                  </Form>
                </Formik>
              </>
            )}
          </div>
        </section>
      </main>
    </Shell>
  );
}

export default Emergency;
