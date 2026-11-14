import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Formik,
  Form,
  Field as FormikField,
  ErrorMessage,
  useFormikContext,
} from "formik";
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
import {
  getInternationalPhoneNumber,
  getMaxNationalNumberLength,
  getPhonePlaceholder,
  phoneCountries,
} from "@/lib/phone";

const appointmentSchema = Yup.object({
  name: Yup.string().trim().required("Please enter your name."),
  country: Yup.string().required("Choose a country calling code."),
  phone: Yup.string()
    .required("Mobile number is required.")
    .test(
      "valid-country-phone",
      "Enter a valid mobile number for the selected country.",
      function (value) {
        if (!value) return true;
        return Boolean(getInternationalPhoneNumber(value, this.parent.country));
      },
    ),
  reason: Yup.string().required("Choose a specialty."),
  date: Yup.string().required("Choose a preferred date."),
  email: Yup.string().email("Enter a valid email address.").optional(),
  time: Yup.string().optional(),
  notes: Yup.string().max(500, "Keep your note under 500 characters."),
});

function CountryPhoneField() {
  const { values, setFieldValue } = useFormikContext();
  const maxDigits = getMaxNationalNumberLength(values.country);
  const selectedCountry = phoneCountries.find(
    ({ country }) => country === values.country,
  );

  return (
    <Field label="Mobile number" id="appointment-phone">
      <span className="mt-2 flex w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.76)] shadow-sm transition focus-within:border-[hsl(var(--primary))] focus-within:ring-4 focus-within:ring-[hsl(var(--primary)/.12)]">
        <span className="relative w-20 min-w-20 shrink-0 border-r border-[hsl(var(--border))]">
          <span className="sr-only">Country calling code</span>
          <FormikField
            as="select"
            name="country"
            aria-label="Country calling code"
            data-testid="select-appointment-country"
            onChange={(event) => {
              setFieldValue("country", event.target.value);
              setFieldValue("phone", "");
            }}
            className="h-full min-h-[3.25rem] w-full appearance-none bg-transparent py-3 pl-3 pr-9 text-sm font-semibold text-transparent outline-none [&>option]:text-[hsl(var(--foreground))]"
          >
            {phoneCountries.map(({ country, name, callingCode }) => (
              <option key={country} value={country}>
                {name} (+{callingCode})
              </option>
            ))}
          </FormikField>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[hsl(var(--foreground))]"
          >
            +{selectedCountry?.callingCode}
          </span>
          <FaChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--muted-foreground))]"
          />
        </span>
        <FormikField name="phone">
          {({ field }) => (
            <input
              {...field}
              id="appointment-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={maxDigits}
              data-testid="input-appointment-phone"
              placeholder={getPhonePlaceholder(values.country)}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "");
                setFieldValue("phone", digits.slice(0, maxDigits));
              }}
              className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))]"
            />
          )}
        </FormikField>
      </span>
      <span className="mt-1.5 block text-[11px] font-normal text-[hsl(var(--muted-foreground))]">
        Enter up to {maxDigits} digits for the selected country.
      </span>
    </Field>
  );
}

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
              country: "IN",
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
                const { country, ...appointmentValues } = values;
                const phone = getInternationalPhoneNumber(
                  values.phone,
                  country,
                );
                if (!phone)
                  throw new Error(
                    "Enter a valid mobile number for the selected country.",
                  );
                const submission = { ...appointmentValues, phone };
                await createAppointment(submission);
                setSubmittedValues(submission);
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
                <CountryPhoneField />
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
                  <span className="relative mt-2 block">
                    <FaStethoscope
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--primary))]"
                    />
                    <FormikField
                      as="select"
                      name="reason"
                      id="appointment-reason"
                      data-testid="select-appointment-reason"
                      className="appointment-specialty-select w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.76)] py-3 pl-11 pr-11 text-sm font-medium text-[hsl(var(--foreground))] shadow-sm outline-none transition focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary)/.12)]"
                    >
                      <option value="">Choose a specialty</option>
                      {specialties.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </FormikField>
                    <FaChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                    />
                  </span>
                </Field>
                <Field label="Preferred date" id="appointment-date">
                  <span className="relative mt-2 block">
                    <FaCalendarDays
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--primary))]"
                    />
                    <FormikField
                      name="date"
                      id="appointment-date"
                      type="date"
                      data-testid="input-appointment-date"
                      className="appointment-date-time w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.76)] py-3 pl-11 pr-4 text-sm font-medium text-[hsl(var(--foreground))] shadow-sm outline-none transition focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary)/.12)]"
                    />
                  </span>
                  <span className="mt-1.5 block text-[11px] font-normal text-[hsl(var(--muted-foreground))]">
                    Choose a day that works for you.
                  </span>
                </Field>
                <Field label="Preferred time" id="appointment-time">
                  <span className="relative mt-2 block">
                    <FaClock
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--primary))]"
                    />
                    <FormikField
                      name="time"
                      id="appointment-time"
                      type="time"
                      data-testid="input-appointment-time"
                      className="appointment-date-time w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.76)] py-3 pl-11 pr-4 text-sm font-medium text-[hsl(var(--foreground))] shadow-sm outline-none transition focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary)/.12)]"
                    />
                  </span>
                  <span className="mt-1.5 block text-[11px] font-normal text-[hsl(var(--muted-foreground))]">
                    Our team will confirm the exact appointment time.
                  </span>
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
