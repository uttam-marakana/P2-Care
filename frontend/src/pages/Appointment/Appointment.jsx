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
import { createAppointment } from "@/services/cms";
import { openWhatsApp, appointmentWhatsAppMessage } from "@/lib/whatsapp";

const appointmentSchema = Yup.object({
  name: Yup.string().trim().required("Please enter your name."),
  phone: Yup.string()
    .trim()
    .matches(/^[+0-9 ()-]{8,18}$/, "Enter a valid mobile number.")
    .required("Mobile number is required."),
  reason: Yup.string().required("Choose a specialty."),
  date: Yup.string().required("Choose a preferred date."),
  email: Yup.string().email("Enter a valid email address.").optional(),
  time: Yup.string().optional(),
  notes: Yup.string().max(500, "Keep your note under 500 characters."),
});

function Appointment() {
  const { doctors, specialties, articles, faqs } = useCmsData();
  const [submitted, setSubmitted] = useState(false);
  const [submittedValues, setSubmittedValues] = useState(null);
  const [submitError, setSubmitError] = useState("");

  if (submitted)
    return (
      <Shell>
        <main>
          <section className="mx-auto flex min-h-[630px] max-w-[1400px] 2xl:max-w-[1600px] items-center justify-center px-5 py-20 lg:px-8">
            <div className="max-w-xl text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]">
                <FaCheck size={28} />
              </span>
              <p className="mt-7 font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">
                Request received
              </p>
              <h1
                data-testid="status-appointment-success"
                className="mt-4 font-display text-6xl leading-[.9]"
              >
                We’ll help make this easy.
              </h1>
              <p className="mt-6 text-base leading-7 text-[hsl(var(--muted-foreground))]">
                Thank you. A P2Care coordinator will call you shortly to confirm
                the best time.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/" testId="link-appointment-success-home">
                  Back home
                </ButtonLink>
                <ButtonLink
                  href="/contact"
                  inverse
                  testId="link-appointment-success-contact"
                >
                  Ask another question
                </ButtonLink>
                {submittedValues && (
                  <button
                    type="button"
                    data-testid="button-appointment-whatsapp"
                    onClick={() =>
                      openWhatsApp(appointmentWhatsAppMessage(submittedValues))
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5"
                  >
                    Continue on WhatsApp <FaMessage size={16} />
                  </button>
                )}
              </div>
            </div>
          </section>
        </main>
      </Shell>
    );

  return (
    <Shell>
      <main>
        <PageHero
          eyebrow="Make a plan"
          title={
            <>
              A few details. Then{" "}
              <em className="text-[hsl(var(--primary))]">
                we’ll take it from here.
              </em>
            </>
          }
          body="Tell us what you need and your preferred time. This is a request, not a commitment — a care coordinator confirms every visit."
        />
        <section className="mx-auto grid max-w-[1000px] gap-10 px-5 py-14 lg:grid-cols-[1fr_.55fr] lg:px-8 lg:py-20">
          <Formik
            initialValues={{
              name: "",
              phone: "",
              email: "",
              reason: "",
              date: "",
              time: "",
              notes: "",
            }}
            validationSchema={appointmentSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitError("");
              try {
                await createAppointment(values);
                setSubmittedValues(values);
                setSubmitted(true);
              } catch (error) {
                setSubmitError(
                  error.message ||
                    "Unable to submit your request. Please call our helpline.",
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <Form
              data-testid="form-appointment"
              className="rounded-[30px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-9"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Request a visit</h2>
                  <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    Usually takes less than 2 minutes.
                  </p>
                </div>
                <span className="font-mono text-xs text-[hsl(var(--accent))]">
                  01—05
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name" id="appointment-name">
                  <FormikField
                    name="name"
                    id="appointment-name"
                    data-testid="input-appointment-name"
                    placeholder="e.g. Meera Sharma"
                  />
                </Field>
                <Field label="Mobile number" id="appointment-phone">
                  <FormikField
                    name="phone"
                    id="appointment-phone"
                    type="tel"
                    data-testid="input-appointment-phone"
                    placeholder="+91"
                  />
                </Field>
                <Field label="Email (optional)" id="appointment-email">
                  <FormikField
                    name="email"
                    id="appointment-email"
                    type="email"
                    data-testid="input-appointment-email"
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="What can we help with?" id="appointment-reason">
                  <FormikField
                    as="select"
                    name="reason"
                    id="appointment-reason"
                    data-testid="select-appointment-reason"
                  >
                    <option value="">Choose a specialty</option>
                    {specialties.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </FormikField>
                </Field>
                <Field label="Preferred date" id="appointment-date">
                  <FormikField
                    name="date"
                    id="appointment-date"
                    type="date"
                    data-testid="input-appointment-date"
                  />
                </Field>
                <Field label="Preferred time" id="appointment-time">
                  <FormikField
                    name="time"
                    id="appointment-time"
                    type="time"
                    data-testid="input-appointment-time"
                  />
                </Field>
              </div>
              <Field
                label="Anything you’d like us to know?"
                id="appointment-notes"
              >
                <FormikField
                  as="textarea"
                  name="notes"
                  id="appointment-notes"
                  rows={4}
                  data-testid="textarea-appointment-notes"
                  placeholder="A short note helps us prepare…"
                />
              </Field>
              <button
                type="submit"
                data-testid="button-submit-appointment"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3.5 text-sm font-bold text-[hsl(var(--primary-foreground))] hover:-translate-y-0.5"
              >
                Request appointment <FaArrowRight size={16} />
              </button>
              {submitError && (
                <p className="mb-2 text-xs text-[hsl(var(--accent))]">
                  {submitError}
                </p>
              )}
              <div className="mt-3 space-y-1 text-xs text-[hsl(var(--accent))]">
                <ErrorMessage name="name" />
                <ErrorMessage name="phone" />
                <ErrorMessage name="email" />
                <ErrorMessage name="reason" />
                <ErrorMessage name="date" />
                <ErrorMessage name="time" />
                <ErrorMessage name="notes" />
              </div>
              <p className="mt-4 text-center text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">
                By continuing, you agree to be contacted by P2Care about your
                request.
              </p>
            </Form>
          </Formik>
          <aside className="space-y-4">
            <div className="rounded-[28px] bg-[hsl(var(--secondary))] p-6">
              <FaWandMagicSparkles size={20} />
              <h3 className="mt-10 text-xl font-bold">Not sure who to see?</h3>
              <p className="mt-2 text-sm leading-6 opacity-70">
                That’s exactly what our care desk is for. We’ll listen and guide
                you to the right team.
              </p>
              <a
                href="tel:+9118001234567"
                data-testid="link-appointment-helpline"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold"
              >
                <FaPhone size={16} /> +91 1800 123 4567
              </a>
            </div>
            <div className="rounded-[28px] border border-[hsl(var(--border))] p-6">
              <FaClock size={20} className="text-[hsl(var(--primary))]" />
              <h3 className="mt-7 font-bold">Care desk hours</h3>
              <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                Mon–Sat, 8:00 AM–8:00 PM
                <br />
                Emergency care: 24 hours
              </p>
            </div>
          </aside>
        </section>
      </main>
    </Shell>
  );
}

export default Appointment;
