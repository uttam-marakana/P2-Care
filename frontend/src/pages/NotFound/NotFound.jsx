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

function NotFoundPage() {
  const { doctors, specialties, articles, faqs } = useCmsData();
  return <Shell><main className="mx-auto flex min-h-[600px] max-w-[800px] flex-col items-center justify-center px-5 text-center"><p className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))]">404 / wrong turn</p><h1 className="mt-4 font-display text-7xl">Let’s get you back to care.</h1><p className="mt-4 text-[hsl(var(--muted-foreground))]">That page doesn’t exist, but the next right step is close.</p><ButtonLink href="/" testId="link-not-found-home">Back to P2Care <FaArrowRight size={16} /></ButtonLink></main></Shell>;
}

export default NotFoundPage;
