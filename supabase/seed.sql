-- Optional initial CMS content. Run after schema.sql.
insert into public.services (name, slug, detail, icon, status) values
('Cardiology','cardiology','Heart, rhythm & vascular care','heart','published'),
('Orthopedics','orthopedics','Movement, bones & joints','bone','published'),
('Neurology','neurology','Brain, spine & nerve health','brain','published'),
('Pediatrics','pediatrics','Thoughtful care for growing lives','baby','published'),
('Women''s Health','womens-health','Care through every chapter','flower','published'),
('General Medicine','general-medicine','Your everyday health partner','stethoscope','published')
on conflict (slug) do nothing;

insert into public.doctors (name,slug,specialty,credentials,experience,availability,initials,tone,bio,languages,status) values
('Dr. Ananya Mehta','ananya-mehta','Cardiology','MBBS, MD, DM (Cardiology)','18 years','Today, 4:30 PM','AM','from-[#c8e4df] to-[#8dbdc0]','A calm, evidence-led cardiologist who believes every patient deserves to understand their heart as well as they understand their symptoms.',array['English','Hindi','Punjabi'],'published'),
('Dr. Rohan Kapoor','rohan-kapoor','Orthopedics','MBBS, MS (Orthopedics)','14 years','Tomorrow, 10:00 AM','RK','from-[#f0dfc3] to-[#cfaaa0]','Specialising in joint preservation and sports injuries, Dr. Kapoor pairs precise treatment plans with practical recovery support.',array['English','Hindi','Punjabi'],'published'),
('Dr. Simran Kaur','simran-kaur','Pediatrics','MBBS, DNB (Pediatrics)','11 years','Today, 2:00 PM','SK','from-[#d6d9ed] to-[#a2b6c9]','Dr. Kaur brings a gentle, unhurried approach to children’s health — from newborn care to adolescent wellbeing.',array['English','Hindi','Punjabi'],'published'),
('Dr. Vivek Sharma','vivek-sharma','Neurology','MBBS, MD, DM (Neurology)','21 years','Wed, 11:30 AM','VS','from-[#d7e3d2] to-[#a5c1ad]','A neurologist focused on listening closely, translating complexity, and helping families find a clear path forward.',array['English','Hindi'],'published'),
('Dr. Neha Bedi','neha-bedi','Women''s Health','MBBS, MS (OBGYN)','16 years','Today, 5:00 PM','NB','from-[#e9d5d8] to-[#c8a7ad]','Thoughtful, inclusive women’s health care with expertise across preventive screenings, pregnancy, and hormonal health.',array['English','Hindi','Punjabi'],'published'),
('Dr. Arjun Singh','arjun-singh','General Medicine','MBBS, MD (Medicine)','12 years','Thu, 9:30 AM','AS','from-[#d2e4eb] to-[#8bb7c6]','Your first point of care for the everyday and the unexpected, with a focus on prevention and whole-person health.',array['English','Hindi','Punjabi'],'published')
on conflict (slug) do nothing;

insert into public.articles (title,slug,category,excerpt,date,read,tone,status) values
('The quiet signs your heart may be asking for attention','heart-health-mohali','Heart health','Small changes are worth noticing. Here is how to tell what needs a doctor’s eye and what can wait.','06 Jun 2024','5 min read','from-[#d5e9e4] via-[#bddbd7] to-[#a4c3c9]','published'),
('Why your joints feel different when the weather turns','monsoon-joints','Orthopedics','A practical guide to movement, stiffness and the simple habits that help you stay comfortable.','28 May 2024','4 min read','from-[#e7dfcf] via-[#d7d2c3] to-[#bacbc8]','published'),
('A parent’s calm guide to fever in children','child-fever','Family care','When to observe at home, when to call your paediatrician, and when to head in right away.','14 May 2024','6 min read','from-[#e1e4ef] via-[#c6d2df] to-[#a7bec8]','published'),
('The restorative science of a good night’s sleep','sleep-brain','Neurology','Better sleep is not a luxury. Understand the daily cues that help your brain reset.','02 May 2024','7 min read','from-[#d8e4d9] via-[#c4d7c8] to-[#b1c4c3]','published')
on conflict (slug) do nothing;

insert into public.faqs (q,a,category,status) values
('How do I book an appointment?','Choose “Book an appointment” from any page, select a specialty or doctor, and share a few details. Our care desk confirms your preferred time by phone or SMS.','Appointments','published'),
('Where is Shalby Hospital Mohali located?','You will find us at Silver Oaks Hospital, Phase-IX, Sector-63, SAS Nagar, Mohali, Punjab 160062, India. The campus has clear signage and accessible parking.','Hospital','published'),
('Is emergency care available at all times?','Yes. Our emergency care team is available 24 hours a day, 7 days a week. For a life-threatening emergency, call +91 1800 123 4567 or your local emergency service.','Emergency','published'),
('Can I change or cancel my appointment?','Of course. Call our patient helpline at +91 1800 123 4567 and our care coordinators will help you find a better time.','Appointments','published'),
('What should I bring for my first visit?','Please bring a photo ID, previous reports or prescriptions, insurance details if relevant, and a list of current medicines.','Hospital','published')
on conflict do nothing;
