import { Link, useParams } from "react-router-dom";
import PageHero from "@/components/common/PageHero";
import Shell from "@/components/layout/Shell";
import { SEO } from "@/components/seo";

const policies = [
  {
    slug: "privacy",
    label: "Privacy notice",
    title: "Privacy and personal data notice",
    summary:
      "A draft overview of personal information handled through the P2Care website and patient portal.",
    sections: [
      {
        heading: "Who is responsible",
        paragraphs: [
          "Before publication, the hospital must identify the legal entity responsible for this website, its registered address, and an approved privacy contact: [hospital legal name], [registered address], [privacy contact email and phone].",
          "This draft is not a final privacy notice or legal advice. The hospital's privacy lead and legal counsel must review and approve it against the services actually offered and applicable Indian law.",
        ],
      },
      {
        heading: "Information this website may receive",
        paragraphs: [
          "Depending on the feature you use, the website may receive contact details, appointment preferences, messages, newsletter choices, patient-account identifiers, and information you choose to provide. Do not send emergency details or unnecessary medical information through general website forms.",
          "The patient-report feature requires a configured private Firebase Storage bucket. It is unavailable until the hospital enables and verifies that storage. Do not promise report uploads or submit reports while it is unavailable.",
          "Vercel Analytics and Speed Insights are listed as frontend dependencies, but the application source does not initialize them. The hospital must verify deployment tracking settings, what data is collected, and any notice or consent requirements before this notice is approved.",
        ],
      },
      {
        heading: "How information may be used",
        paragraphs: [
          "Information may be used to respond to appointment and contact requests, operate patient accounts, provide requested updates, protect the service, and maintain or improve the website. The hospital must document the specific purposes and applicable legal grounds before launch.",
        ],
      },
      {
        heading: "Service providers and storage",
        paragraphs: [
          "The current architecture uses Vercel for the frontend, Render for the API, and Firebase Authentication and Firestore for account and application data. Resend may be used for email when configured. Public website media is stored on the backend host. The hospital must verify provider settings, processing locations, contracts, retention, access controls, and backup arrangements.",
          "Private patient reports are designed for Firebase Storage and are not available unless the bucket is configured. Do not use the backend's ordinary local filesystem for patient reports.",
        ],
      },
      {
        heading: "Retention, requests, and grievances",
        paragraphs: [
          "The hospital must publish approved retention periods for each data category and explain how individuals can submit privacy requests or grievances. Complete before publication: [retention schedule], [privacy/grievance contact], [request procedure], and [response process].",
        ],
      },
      {
        heading: "Security and updates",
        paragraphs: [
          "The hospital should describe only safeguards that have been implemented and verified. No website or transmission method can be represented as completely secure. The hospital must set an effective date, review this notice when services or providers change, and provide approved local-language versions.",
        ],
      },
    ],
  },
  {
    slug: "patient-rights",
    label: "Patient rights and responsibilities",
    title: "Patient rights and responsibilities",
    summary:
      "A hospital-review draft covering respectful care, communication, privacy, and shared responsibilities.",
    sections: [
      {
        heading: "Our commitment to patients",
        paragraphs: [
          "The hospital should publish its approved patient-rights charter here, including how patients can receive understandable information, ask questions, participate in care decisions, seek support, raise concerns, and request access to records in accordance with applicable law and hospital procedures.",
          "The hospital must confirm the exact rights, exceptions, support arrangements, and applicable clinical policies with its clinical governance and legal teams before publication.",
        ],
      },
      {
        heading: "Patient and visitor responsibilities",
        bullets: [
          "Provide accurate information relevant to care and tell the care team when information changes.",
          "Ask questions when instructions or proposed care are unclear, and share relevant medicines, allergies, and health history with the clinical team.",
          "Treat patients, visitors, and staff respectfully and follow reasonable safety and infection-prevention instructions.",
          "Follow the hospital's approved appointment, visitor, and billing processes; ask staff for help if a requirement is difficult to meet.",
        ],
      },
      {
        heading: "Help and concerns",
        paragraphs: [
          "For assistance or to raise a concern, use the hospital's approved channels: [patient relations contact], [phone], [email], and [in-person location and hours]. Do not publish this draft until those details and escalation steps are confirmed.",
        ],
      },
    ],
  },
  {
    slug: "website-terms",
    label: "Website terms",
    title: "Website terms of use",
    summary:
      "Draft terms for using the informational website, forms, and patient-account features.",
    sections: [
      {
        heading: "Website information and care",
        paragraphs: [
          "Website content is general information and is not a diagnosis, medical advice, or a substitute for assessment by a qualified healthcare professional. Do not delay urgent care because of information on this site.",
          "Submitting an appointment request does not confirm a booking or create a clinician-patient relationship. The hospital must confirm the appointment and explain any applicable fees or conditions directly.",
        ],
      },
      {
        heading: "Using forms and accounts",
        paragraphs: [
          "Provide accurate information, use only accounts you are authorized to access, and do not submit unlawful, misleading, or harmful content. Do not use general contact or appointment forms to send emergency information or documents.",
          "The hospital must add its approved account, cancellation, availability, and support terms before publication. No online payment or refund terms should be implied unless the hospital adds and verifies that functionality.",
        ],
      },
      {
        heading: "External services and changes",
        paragraphs: [
          "The website may link to third-party services. The hospital does not control their content or practices and should identify relevant services in the approved privacy notice. The hospital must add its approved intellectual-property, liability, governing-law, and dispute terms before publication.",
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    label: "Accessibility",
    title: "Accessibility statement",
    summary:
      "A draft accessibility statement with a route for reporting barriers; conformance has not been independently verified.",
    sections: [
      {
        heading: "Access support",
        paragraphs: [
          "The hospital aims to make its website and services accessible. This statement is not a claim of conformance to any accessibility standard; the site needs an accessibility audit and hospital approval before such a claim can be made.",
          "If you encounter a barrier or need an accommodation, contact [accessibility contact], [phone], or [email]. Add an approved response process and expected response time before publication.",
        ],
      },
      {
        heading: "Review and improvements",
        paragraphs: [
          "The hospital should document tested assistive technologies, known limitations, remediation priorities, and an owner for accessibility requests. Provide reviewed Gujarati, Hindi, and English versions as appropriate.",
        ],
      },
    ],
  },
  {
    slug: "complaints",
    label: "Complaints and grievances",
    title: "Complaints and grievance process",
    summary:
      "A draft route for patients and visitors to raise service concerns and learn how they will be handled.",
    sections: [
      {
        heading: "How to raise a concern",
        paragraphs: [
          "Contact the hospital's patient relations or grievance office: [office name], [phone], [email], [postal address or in-person location], and [hours]. Include only information necessary to identify and investigate the concern; avoid sending sensitive medical records through unapproved channels.",
        ],
      },
      {
        heading: "What happens next",
        paragraphs: [
          "The hospital must document acknowledgement and response timelines, escalation contacts, urgent clinical-safety handling, recordkeeping, and any external escalation route required by applicable law. These details are intentionally left for hospital approval and must be completed before publication.",
        ],
      },
      {
        heading: "Immediate clinical concerns",
        paragraphs: [
          "This website is not an emergency-response channel. For urgent or life-threatening concerns, contact local emergency services or go to the nearest emergency department.",
        ],
      },
    ],
  },
  {
    slug: "appointments",
    label: "Appointments and cancellations",
    title: "Appointments, fees, and cancellations",
    summary:
      "A draft explaining that online appointment requests require confirmation and that hospital-specific terms remain to be added.",
    sections: [
      {
        heading: "Appointment requests",
        paragraphs: [
          "An online request is not a confirmed appointment. The hospital team must contact you to confirm availability, date, time, location, and any preparation instructions. Do not rely on an online form for urgent or emergency care.",
        ],
      },
      {
        heading: "Fees and insurance",
        paragraphs: [
          "The hospital must provide its approved consultation, service, deposit, insurance, and payment information directly. This website does not describe or guarantee coverage, reimbursement, or final charges.",
        ],
      },
      {
        heading: "Changes and cancellations",
        paragraphs: [
          "Before publication, add the hospital's approved process for rescheduling and cancellation, relevant notice periods, missed appointments, refunds (if applicable), and the contact channel for changes: [policy and contact details].",
        ],
      },
    ],
  },
  {
    slug: "medical-emergency",
    label: "Medical and emergency disclaimer",
    title: "Medical information and emergency disclaimer",
    summary:
      "A draft disclaimer clarifying that website content and forms are not a substitute for urgent clinical care.",
    sections: [
      {
        heading: "Not a substitute for medical care",
        paragraphs: [
          "Website content is for general information only. It is not a diagnosis, individual medical advice, or a substitute for consultation with a qualified healthcare professional. The hospital must have clinicians review all health information and emergency instructions before publication.",
        ],
      },
      {
        heading: "Emergencies",
        paragraphs: [
          "Do not use this website, email, messaging, or appointment forms for an emergency. If someone may be in immediate danger or needs urgent medical attention, contact local emergency services or go to the nearest emergency department now.",
          "The hospital must verify and publish its own emergency department availability, direct phone number, and local instructions. Online requests may not be monitored continuously.",
        ],
      },
    ],
  },
];

export const policyLinks = policies.map(({ slug, label }) => ({ slug, label }));

export default function Policies() {
  const { slug } = useParams();
  const policy = policies.find((item) => item.slug === slug);

  if (!policy) {
    return (
      <Shell>
        <div lang="en">
          <SEO title="Policy not found" noindex />
          <main className="mx-auto max-w-3xl px-5 py-20">
            <h1 className="font-display text-5xl">Policy not found</h1>
            <Link className="mt-6 inline-block underline" to="/">
              Return to the home page
            </Link>
          </main>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div lang="en">
        <SEO title={policy.title} description={policy.summary} noindex />
        <PageHero
          eyebrow="Hospital policy draft"
          title={policy.title}
          body={policy.summary}
        />
        <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-16">
          <aside
            role="alert"
            className="mb-10 rounded-2xl border border-amber-400/60 bg-amber-50 p-5 text-sm leading-6 text-amber-950"
          >
            <strong>Draft — not approved for hospital use.</strong> These
            templates are not legal advice. The hospital must complete the
            placeholders, confirm its actual practices, obtain legal and
            clinical review where applicable, and approve translations before
            relying on or publishing these policies for patients.
          </aside>
          <div className="space-y-10">
            {policy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-3xl text-[hsl(var(--foreground))]">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 text-[15px] leading-7 text-[hsl(var(--muted-foreground))]"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 list-disc space-y-3 pl-6 text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
          <p className="mt-12 border-t pt-6 text-sm text-[hsl(var(--muted-foreground))]">
            Need help?{" "}
            <Link className="font-semibold underline" to="/contact">
              Contact the hospital
            </Link>
            . The contact details and grievance process must be verified by the
            hospital before these draft policies are used.
          </p>
        </main>
      </div>
    </Shell>
  );
}
