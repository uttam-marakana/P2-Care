import { useMemo } from "react";
import SEO from "./SEO";

export default function HospitalSchema({ title, description, canonical }) {
  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": ["Hospital", "LocalBusiness", "Organization"],
      name: "P2Care Hospital Mohali",
      url: canonical || `${window.location.origin}${window.location.pathname}`,
      telephone: "+91 1800 123 4567",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Phase-IX, Sector-63",
        addressLocality: "SAS Nagar, Mohali",
        addressRegion: "Punjab",
        postalCode: "160062",
        addressCountry: "IN",
      },
      areaServed: "Mohali, Punjab, India",
      medicalSpecialty: [
        "Cardiology",
        "Orthopedics",
        "Neurology",
        "Paediatrics",
        "Gynaecology",
      ],
    }),
    [canonical],
  );
  return (
    <SEO
      title={title}
      description={description}
      canonical={canonical}
      schema={schema}
    />
  );
}
