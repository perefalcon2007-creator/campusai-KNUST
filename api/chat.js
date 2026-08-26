export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const GROQ_KEY = process.env.GROQ_API_KEY;
  const userMsg = req.body.message || "";

  // --- MAXIMUM KNUST KNOWLEDGE BASE 2025/2026 ---
  const KNOWLEDGE = `
KNUST OFFICIAL DATA 2025/2026 ADMISSION YEAR - VERIFIED:

1. ADMISSION REQUIREMENTS:
- WASSCE: A1-C6 in 3 Core (English, Maths, Integrated Science) + 3 Electives relevant. Aggregate max 24, but competitive courses need 06-12.
- Aggregate calculation: A1=1, B2=2, B3=3, C4=4, C5=4, C6=4. D7/E8/F9 NOT accepted.
- E-Voucher: GH¢250 Ghanaian, $100 International. Buy via *415*55# or admission portal.
- Entrance Exam for Human Biology Medicine: 100 MCQs Bio/Chem/Phys/Maths/Reasoning. WASSCE cut for exam invite: Med 08, Dentistry 12. Date Dec 10.

2. FULL CUT-OFF POINTS - KUMASI MAIN CAMPUS (Lower = more competitive):
COLLEGE OF HEALTH SCIENCES:
Human Biology (Medicine) 06, BDS Dental Surgery 06 (Fee-paying only), Pharm D 06, Physician Assistantship 06, Nursing 07-08, Midwifery 08-09, Medical Lab 07, Medical Imaging 07, Physiotherapy & Sports Sci 07, Veterinary Medicine 09-10, Herbal Medicine 09-11, Emergency Nursing 10, Disability & Rehab 17.

COLLEGE OF ENGINEERING:
Biomedical Eng 06, Petroleum Eng 07-08, Computer Eng 08, Electrical/Electronic Eng 07-08, Aerospace Eng 08-09, Chemical Eng 08-10, Civil Eng 09, Mechanical Eng 09, Telecom Eng 10-11, Petrochemical Eng 08, Geological Eng 12, Geomatic Eng 14, Agricultural Eng 17, Materials Eng 12, Metallurgical Eng 16, Industrial Eng 12.

COLLEGE OF SCIENCE:
Doctor of Optometry 06-07, Computer Science 07-10-11, Actuarial Science 08-10-11, Biological Sciences 09-10, Biochemistry 07-11, Maths 19/13, Statistics 13-15, Physics 19, Chemistry 16, Environmental Science 16, Food Science 11, Meteorology 19, IT 12.

COLLEGE OF ART & BUILT ENVIRONMENT:
Architecture 08-09, Construction Tech & Mgt 11-14, Quantity Surveying 10, Development Planning 11-12, Land Economy 09, Real Estate 10-13, Fashion Design 12-16, Communication Design 13-14, Painting & Sculpture 20, Ceramics 24, Metalsmithing 24, Textile Design 18.

COLLEGE OF HUMANITIES & SOCIAL SCIENCES:
Law LLB 06-07, Business Admin Accounting/Finance 07-08-09, HRM/Management 09-12, Marketing/International Business 09-15, Logistics 09-16, Hospitality & Tourism 13, Economics 13, Political Studies 10-12, Sociology 14, Social Work 15, History 17-18, English 16-20, Geography 14-15, Akan 23, French 15, Communication Studies 12, Culture & Tourism 16-17, Linguistics 22.

COLLEGE OF AGRICULTURE & NATURAL RESOURCES:
Agriculture 24, Agribusiness Mgt 15, Agricultural Biotechnology 18, Landscape Design 23, Natural Resources Mgt 19, Aquaculture 20, Forest Resources Tech 24.

OBUASI CAMPUS (slightly relaxed):
Civil Eng 11-14, Electrical 10, Geological 14, Geomatic 15, Materials 15, Mechanical 12, Metallurgical 16, Medical Lab 09-10, Nursing 11-12, Midwifery 13, BBA Accounting 12, BBA HRM 15, BBA Marketing 16, Environmental Science 19.

3. FEES 2025/2026 PROVISIONAL (GH¢, Ghanaian Regular):
Humanities/Social Sciences 6345-7010, Business Admin 7240, Law 10090, Engineering 8820-9679, Art & Built 7220, Agric 7220, Science 7011-7020, Actuarial/Maths 6411-6620, Optometry 8430-8350, Pharm D 9376, Vet Med 9269, Nursing 7640-7848, Disability 6530, Physician Assistant 7981, Human Biology 9999, Medicine & Surgery MBCHB 11614, Fee-Paying Freshers 6345-11614, GUSS Hostel fees separate.
IDL Distance: BBA 4843, Computer Science 6395, etc.

4. ACCOMMODATION - REAL 2025/2026 PRICES:
- Traditional Halls (Unity, Africa, Independence, Queens, Republic, University Hall Katanga): GH¢2167.80/year total fixed by govt. Includes utilities + ICT. Only for 1st years + few final years. Cannot increase without Parliament. Currently frozen since 2022.
- GUSSS Hostels (Brunei, Baby, Old, New, Complex Block S, Hall 7, Tek Credit, etc):
  4-in-1 = 5525, 3-in-1 = 6610, 2-in-2 = 7245, 2-in-1 Complex = 7735, 2-in-1 = 8470 GHC/year (includes hostel + utility, 2024/25 price). Pay via GCB/CBG/Ecobank reservation code.
- Private Hostels Ayeduase/Kotei/Bomso/Ayigya/Gaza (Off-campus, 8-10 months academic year, MANY charge utilities separate 500-1000 extra):
  Budget range: 4-in-a-room 2000-2500 (some old hostels), 3-in-1 2600-3500
  Mid-range (most popular): 4-in-1 4000-5525 (Brunei style), 2-in-1 5000-8000 (Kairos, Victory standard). Official KNUST report says average private hostel now GH¢6000-7000.
  Premium/Luxury (New buildings with TV, Fridge, CCTV, generator, kitchen): Shepherdsville 2024/25: 4-in-1 4000, 3-in-1 5000, 2-in-1 6000, Single 9200. Victory Tower/Kairos: 3-in-1 8000, 2-in-1 10000, 1-in-a-room Standard 15000, Executive 19000. Recent Rent Control inspection: Victory Tower single 20000, double 14000 each, triple 10000 each, quadruple 9000 each. Liendavel: single 20000, double 13000, triple 9500.
  Always tell student: Ask if price includes utilities, water, light, maintenance, and duration (academic year vs 12 months). Always say PER ACADEMIC YEAR, not per month. If converting monthly, multiply by 10 months not 12.

5. ADMISSION TIPS FOR 2026/2027:
- Cut-offs change yearly based on competition. 06-07 courses need straight A1s. Meeting cut-off does NOT guarantee admission, depends on slots.
- Apply 2 programmes. Put more competitive first.
- Fee-paying option allows higher aggregate (e.g., Medicine fee-paying 08 vs regular 06).
- Check portal after WASSCE release to confirm results.
- Hostel booking opens August, private hostels go fast, book early.
`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        temperature: 0.25,
        messages: [
          { role: 'system', content: `You are CampusAI, the KNUST guide built in Kumasi. You are friendly, not rigid, you explain like a senior helping a fresher.
You have this full verified dataset:
${KNOWLEDGE}

Rules:
- Use the dataset for all numbers. Never invent. If course not in list, estimate based on similar faculty but say "around" and ask to check official.
- For hostels, ALWAYS give 3 tiers: Traditional Hall 2167.80 (if fresher), Budget private 2000-4000, Mid 5000-8000, Premium up to 10000-20000. Explain utilities may be extra.
- Always state prices PER ACADEMIC YEAR (not month).
- Be short but accurate, use GHC, mention 2025/2026 is latest.
- If user asks cut-off, give both recent official (07 etc) and note it can shift by 1-2 points in new year.
` },
