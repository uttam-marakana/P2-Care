import { firebaseAuth, firestore } from '../src/lib/firebase.js';
import { config } from '../src/lib/config.js';

if (config.useMockData) throw new Error('Set USE_MOCK_DATA=false before running the Firebase seed.');
if (!firebaseAuth || !firestore) throw new Error('Firebase Admin SDK is not configured.');

const batches = {
  services: [
    ['cardiology', { name: 'Cardiology', slug: 'cardiology', detail: 'Heart, rhythm & vascular care', icon: 'heart', status: 'published' }],
    ['orthopedics', { name: 'Orthopedics', slug: 'orthopedics', detail: 'Movement, bones & joints', icon: 'bone', status: 'published' }],
    ['neurology', { name: 'Neurology', slug: 'neurology', detail: 'Brain, spine & nerve health', icon: 'brain', status: 'published' }],
    ['pediatrics', { name: 'Pediatrics', slug: 'pediatrics', detail: 'Thoughtful care for growing lives', icon: 'baby', status: 'published' }],
    ['womens-health', { name: "Women's Health", slug: 'womens-health', detail: 'Care through every chapter', icon: 'flower', status: 'published' }],
    ['general-medicine', { name: 'General Medicine', slug: 'general-medicine', detail: 'Your everyday health partner', icon: 'stethoscope', status: 'published' }],
  ],
  doctors: [
    ['ananya-mehta', { name: 'Dr. Ananya Mehta', slug: 'ananya-mehta', specialty: 'Cardiology', credentials: 'MBBS, MD, DM (Cardiology)', experience: '18 years', availability: 'Today, 4:30 PM', initials: 'AM', tone: 'from-[#c8e4df] to-[#8dbdc0]', bio: 'A calm, evidence-led cardiologist who believes every patient deserves to understand their heart as well as they understand their symptoms.', languages: ['English', 'Hindi', 'Punjabi'], status: 'published' }],
    ['rohan-kapoor', { name: 'Dr. Rohan Kapoor', slug: 'rohan-kapoor', specialty: 'Orthopedics', credentials: 'MBBS, MS (Orthopedics)', experience: '14 years', availability: 'Tomorrow, 10:00 AM', initials: 'RK', tone: 'from-[#f0dfc3] to-[#cfaaa0]', bio: 'Specialising in joint preservation and sports injuries, Dr. Kapoor pairs precise treatment plans with practical recovery support.', languages: ['English', 'Hindi', 'Punjabi'], status: 'published' }],
    ['simran-kaur', { name: 'Dr. Simran Kaur', slug: 'simran-kaur', specialty: 'Pediatrics', credentials: 'MBBS, DNB (Pediatrics)', experience: '11 years', availability: 'Today, 2:00 PM', initials: 'SK', tone: 'from-[#d6d9ed] to-[#a2b6c9]', bio: 'Dr. Kaur brings a gentle, unhurried approach to children’s health — from newborn care to adolescent wellbeing.', languages: ['English', 'Hindi', 'Punjabi'], status: 'published' }],
    ['vivek-sharma', { name: 'Dr. Vivek Sharma', slug: 'vivek-sharma', specialty: 'Neurology', credentials: 'MBBS, MD, DM (Neurology)', experience: '21 years', availability: 'Wed, 11:30 AM', initials: 'VS', tone: 'from-[#d7e3d2] to-[#a5c1ad]', bio: 'A neurologist focused on listening closely, translating complexity, and helping families find a clear path forward.', languages: ['English', 'Hindi'], status: 'published' }],
    ['neha-bedi', { name: 'Dr. Neha Bedi', slug: 'neha-bedi', specialty: "Women's Health", credentials: 'MBBS, MS (OBGYN)', experience: '16 years', availability: 'Today, 5:00 PM', initials: 'NB', tone: 'from-[#e9d5d8] to-[#c8a7ad]', bio: 'Thoughtful, inclusive women’s health care with expertise across preventive screenings, pregnancy, and hormonal health.', languages: ['English', 'Hindi', 'Punjabi'], status: 'published' }],
    ['arjun-singh', { name: 'Dr. Arjun Singh', slug: 'arjun-singh', specialty: 'General Medicine', credentials: 'MBBS, MD (Medicine)', experience: '12 years', availability: 'Thu, 9:30 AM', initials: 'AS', tone: 'from-[#d2e4eb] to-[#8bb7c6]', bio: 'Your first point of care for the everyday and the unexpected, with a focus on prevention and whole-person health.', languages: ['English', 'Hindi', 'Punjabi'], status: 'published' }],
  ],
  articles: [
    ['heart-health-mohali', { title: 'The quiet signs your heart may be asking for attention', slug: 'heart-health-mohali', category: 'Heart health', excerpt: 'Small changes are worth noticing. Here is how to tell what needs a doctor’s eye and what can wait.', date: '06 Jun 2024', read: '5 min read', tone: 'from-[#d5e9e4] via-[#bddbd7] to-[#a4c3c9]', status: 'published' }],
    ['monsoon-joints', { title: 'Why your joints feel different when the weather turns', slug: 'monsoon-joints', category: 'Orthopedics', excerpt: 'A practical guide to movement, stiffness and the simple habits that help you stay comfortable.', date: '28 May 2024', read: '4 min read', tone: 'from-[#e7dfcf] via-[#d7d2c3] to-[#bacbc8]', status: 'published' }],
    ['child-fever', { title: 'A parent’s calm guide to fever in children', slug: 'child-fever', category: 'Family care', excerpt: 'When to observe at home, when to call your paediatrician, and when to head in right away.', date: '14 May 2024', read: '6 min read', tone: 'from-[#e1e4ef] via-[#c6d2df] to-[#a7bec8]', status: 'published' }],
    ['sleep-brain', { title: 'The restorative science of a good night’s sleep', slug: 'sleep-brain', category: 'Neurology', excerpt: 'Better sleep is not a luxury. Understand the daily cues that help your brain reset.', date: '02 May 2024', read: '7 min read', tone: 'from-[#d8e4d9] via-[#c4d7c8] to-[#b1c4c3]', status: 'published' }],
  ],
  faqs: [
    ['faq-booking', { q: 'How do I book an appointment?', a: 'Choose “Book an appointment” from any page, select a specialty or doctor, and share a few details. Our care desk confirms your preferred time by phone or SMS.', category: 'Appointments', status: 'published' }],
    ['faq-location', { q: 'Where is Shalby Hospital Mohali located?', a: 'You will find us at Silver Oaks Hospital, Phase-IX, Sector-63, SAS Nagar, Mohali, Punjab 160062, India. The campus has clear signage and accessible parking.', category: 'Hospital', status: 'published' }],
    ['faq-emergency', { q: 'Is emergency care available at all times?', a: 'Yes. Our emergency care team is available 24 hours a day, 7 days a week. For a life-threatening emergency, call +91 1800 123 4567 or your local emergency service.', category: 'Emergency', status: 'published' }],
    ['faq-change', { q: 'Can I change or cancel my appointment?', a: 'Of course. Call our patient helpline at +91 1800 123 4567 and our care coordinators will help you find a better time.', category: 'Appointments', status: 'published' }],
    ['faq-first-visit', { q: 'What should I bring for my first visit?', a: 'Please bring a photo ID, previous reports or prescriptions, insurance details if relevant, and a list of current medicines.', category: 'Hospital', status: 'published' }],
  ],
};

async function writeCollection(name, entries) {
  const batch = firestore.batch();
  const now = new Date().toISOString();
  for (const [id, data] of entries) {
    const ref = firestore.collection(name).doc(id);
    const existing = await ref.get();
    if (!existing.exists) batch.set(ref, { id, ...data, created_at: now, updated_at: now });
  }
  await batch.commit();
  console.log(`Seed checked: ${name}`);
}

for (const [name, entries] of Object.entries(batches)) await writeCollection(name, entries);

const email = process.env.FIREBASE_ADMIN_EMAIL;
const password = process.env.FIREBASE_ADMIN_PASSWORD;
let uid = process.env.FIREBASE_ADMIN_UID;
if (!uid && email) {
  try { uid = (await firebaseAuth.getUserByEmail(email)).uid; }
  catch (_) {
    if (!password) throw new Error('FIREBASE_ADMIN_PASSWORD is required when the admin Firebase Auth user does not already exist.');
    uid = (await firebaseAuth.createUser({ email, password, emailVerified: true })).uid;
  }
}
if (uid) {
  const user = await firebaseAuth.getUser(uid);
  const adminEmail = email || user.email || null;
  await firebaseAuth.setCustomUserClaims(uid, { ...(user.customClaims || {}), role: 'admin' });
  await firestore.collection('profiles').doc(uid).set({ id: uid, full_name: process.env.FIREBASE_ADMIN_NAME || 'P2Care Admin', role: 'admin', email: adminEmail, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { merge: true });
  console.log(`Admin profile ready: ${uid}`);
} else {
  console.log('Content seeded. Set FIREBASE_ADMIN_UID or FIREBASE_ADMIN_EMAIL/FIREBASE_ADMIN_PASSWORD to create the admin profile.');
}
