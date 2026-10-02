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

function Articles() {
  const { doctors, specialties, articles, faqs } = useCmsData();
  const [query, setQuery] = useState('');
  const filtered = articles.filter((a) => `${a.title} ${a.category}`.toLowerCase().includes(query.toLowerCase()));
  return <Shell><main><PageHero eyebrow="The P2Care journal" title={<>A clearer way to think about <em className="text-[hsl(var(--primary))]">health.</em></>} body="Practical context, compassionate guidance and stories from the people behind your care." /><section className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] px-5 py-14 lg:px-8 lg:py-20"><div className="mb-10 flex items-center gap-3 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-1"><FaMagnifyingGlass size={17} className="text-[hsl(var(--muted-foreground))]" /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} data-testid="input-article-search" placeholder="FaMagnifyingGlass stories" className="w-full bg-transparent py-3 text-sm outline-none" /></div><div className="grid gap-5 md:grid-cols-2">{filtered.map((article, index) => <Link to="/articles" key={article.id} data-testid={`card-article-${article.id}`} className={`group overflow-hidden rounded-[30px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] ${index === 0 ? 'md:col-span-2 md:grid md:grid-cols-[.9fr_1.1fr]' : ''}`}><div className={`relative min-h-52 overflow-hidden bg-gradient-to-br ${article.tone} p-6 ${index === 0 ? 'md:min-h-full' : ''}`}>{article.image_url && <img src={resolveMediaUrl(article.image_url)} alt="" className="absolute inset-0 h-full w-full object-cover" />}<div className="relative"><span className="rounded-full bg-[hsl(var(--card)/.65)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--primary))]">{article.category}</span></div><span className="float-right font-mono text-xs text-[hsl(var(--primary)/.65)]">0{index + 1}</span></div><div className="p-6 sm:p-8"><p className="text-xs text-[hsl(var(--muted-foreground))]">{article.date} · {article.read}</p><h2 className="mt-3 max-w-lg font-display text-3xl leading-none group-hover:text-[hsl(var(--primary))]">{article.title}</h2><p className="mt-4 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{article.excerpt}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]">Read story <FaArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></span></div></Link>)}</div>{!filtered.length && <div data-testid="empty-articles" className="py-20 text-center"><FaFileLines className="mx-auto text-[hsl(var(--primary))]" /><h2 className="mt-4 font-display text-3xl">No stories found.</h2><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Try a different word.</p></div>}</section></main></Shell>;
}

const contactSchema = Yup.object({
  name: Yup.string().trim().required('Please enter your name.'),
  reply: Yup.string().trim().required('Please provide an email or phone number.'),
  message: Yup.string().trim().min(10, 'Please share a little more detail.').required('Please enter your message.'),
});

export default Articles;
