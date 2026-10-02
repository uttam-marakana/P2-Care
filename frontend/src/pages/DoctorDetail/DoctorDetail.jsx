import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Formik, Form, Field as FormikField, ErrorMessage } from 'formik';
import * as Accordion from '@radix-ui/react-accordion';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { FaArrowRight, FaBaby, FaBell, FaBone, FaBrain, FaCalendarDays, FaCheck, FaChevronDown, FaClock, FaArrowUpRightFromSquare, FaFacebookF, FaFileLines, FaSpa, FaHeartPulse, FaInstagram, FaEnvelope, FaLocationDot, FaBars, FaMessage, FaPhone, FaMagnifyingGlass, FaShieldHalved, FaWandMagicSparkles, FaStar, FaStethoscope, FaSyringe, FaUsers, FaXmark, FaYoutube } from "react-icons/fa6";
import { useCmsData } from '@/context/CmsContext';
import { ButtonLink, PageHero, SectionIntro, Field, InfoTile, imagePath, iconFor, ImageWithFallback } from "@/components/common";
import { Shell } from "@/components/layout";
import { DoctorCard } from "@/components/doctors";
import { resolveMediaUrl } from '@/services/media';

function DoctorDetail() {
  const { doctors, specialties, articles, faqs } = useCmsData();
  const params = useParams();
  const doctor = doctors.find((d) => d.id === params.id) ?? doctors[0];
  return <Shell><main><section className="bg-[hsl(var(--muted)/.5)]"><div className="mx-auto grid max-w-[1400px] 2xl:max-w-[1600px] gap-10 px-5 py-12 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:px-8 lg:py-20"><div className={`relative h-80 overflow-hidden rounded-[34px] bg-gradient-to-br ${doctor.tone} lg:h-[430px]`}>{doctor.image_url ? <img src={resolveMediaUrl(doctor.image_url)} alt={doctor.name} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute right-[-10px] top-[-50px] font-display text-[260px] leading-none text-white/25">{doctor.initials[0]}</div>}<span className="absolute bottom-7 left-7 grid h-24 w-24 place-items-center rounded-[28px] border border-white/50 bg-white/25 font-display text-4xl backdrop-blur-sm">{doctor.initials}</span></div><div><Link to="/doctors" data-testid="link-back-doctors" className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]">← All doctors</Link><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">{doctor.specialty}</p><h1 data-testid={`text-doctor-name-${doctor.id}`} className="mt-3 font-display text-6xl leading-[.9] tracking-[-.035em]">{doctor.name}</h1><p className="mt-5 text-sm font-semibold">{doctor.credentials}</p><p className="mt-5 max-w-lg text-base leading-7 text-[hsl(var(--muted-foreground))]">{doctor.bio}</p><div className="mt-7 flex flex-wrap gap-2">{doctor.languages.map((lang) => <span key={lang} className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.55)] px-3 py-1.5 text-xs">{lang}</span>)}</div><div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/appointment" inverse testId={`link-book-doctor-${doctor.id}`}>Book with {doctor.name.split(' ')[1]} <FaCalendarDays size={16} /></ButtonLink><a href="tel:+9118001234567" data-testid={`link-call-doctor-${doctor.id}`} className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-3 text-sm font-semibold hover:bg-[hsl(var(--card))]"><FaPhone size={16} /> Ask a question</a></div></div></div></section><section className="mx-auto grid max-w-[1400px] 2xl:max-w-[1600px] gap-5 px-5 py-16 lg:grid-cols-3 lg:px-8"><div className="rounded-3xl bg-[hsl(var(--primary))] p-7 text-[hsl(var(--primary-foreground))]"><FaClock size={22} className="text-[hsl(var(--secondary))]" /><h2 className="mt-12 text-xl font-bold">Next available</h2><p className="mt-2 text-2xl font-display text-[hsl(var(--secondary))]">{doctor.availability}</p><p className="mt-2 text-sm text-[hsl(var(--primary-foreground)/.7)]">Outpatient consultations at Shalby Hospital Mohali.</p></div><div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-7"><FaShieldHalved size={22} className="text-[hsl(var(--primary))]" /><h2 className="mt-12 text-xl font-bold">Care philosophy</h2><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Clear explanations, shared decisions, and a care plan that fits real life.</p></div><div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-7"><FaLocationDot size={22} className="text-[hsl(var(--primary))]" /><h2 className="mt-12 text-xl font-bold">Where to find them</h2><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Silver Oaks Hospital, Phase-IFaXmark, Sector-63, Mohali.</p></div></section></main></Shell>;
}

const appointmentSchema = Yup.object({
  name: Yup.string().trim().required('Please enter your name.'),
  phone: Yup.string().trim().matches(/^[+0-9 ()-]{8,18}$/, 'Enter a valid mobile number.').required('Mobile number is required.'),
  reason: Yup.string().required('Choose a specialty.'),
  date: Yup.string().required('Choose a preferred date.'),
  notes: Yup.string().max(500, 'Keep your note under 500 characters.'),
});

export default DoctorDetail;
