export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ reply: 'POST only' });

  const { message = '' } = req.body;
  const q = message.toLowerCase();

  let reply = '';

  if (q.includes('what is knust') || q.includes('meaning') || q.includes('full')) {
    reply = `KNUST means Kwame Nkrumah University of Science and Technology. 🎓

It's located in Kumasi, Ashanti Region, Ghana. It's Ghana's No.1 science & tech university!

- Founded: 1952
- Motto: Nyansabu ne Mpaebo (Wisdom and Skill)
- Best for: Engineering, Medicine, Science, IT, Business, Architecture
- 6 Colleges, 70+ departments
- Main campus: Kumasi, plus Obuasi campus.

What else you wanna know? Cut-off, hostels, or fees?`;
  } else if (q.includes('hostel') || q.includes('accommodation') || q.includes('ayeduase') || q.includes('kotei') || q.includes('bomso')) {
    reply = `🏠 KNUST Hostels Info (2025/2026):

On-Campus Halls (for freshers):
- Unity Hall (Conti), Katanga, Africa, Independence, Queens, Republic
- Price: ~ GHS 1,800 - 2,500 per year
- You get it through portal after admission

Off-Campus (Ayeduase, Kotei, Bomso - most students stay here):
- Budget: GHS 3,000 - 5,000 / year (shared room)
- Mid: GHS 5,500 - 8,000 / year (self-contain, 2 in room)
- Premium: GHS 9,000+ (1 in room, AC, etc)

Popular areas: Ayeduase is closest, Kotei is cheaper, Bomso has good hostels.

Tip: Don't pay any agent until you see room live!`;

  } else if (q.includes('cut') || q.includes('admission') || q.includes('wase') || q.includes('aggregate') || q.includes('requirement')) {
    reply = `📚 KNUST Cut-off Points (General Guide):

Medicine: 06-08
Pharmacy: 07-09
Computer Science: 09-13
Electrical/Electronics Eng: 09-12
Civil Eng: 10-13
Petroleum Eng: 10-14
Business Admin: 10-14
Nursing: 08-11
Law: 07-10

How to calculate: Your 6 best subjects (3 core + 3 electives). Grade A1=1, B2=2... lower is better.

WASSCE requirement: Credit in 3 cores (English, Maths, Science) + 3 relevant electives.

Your question was: "${message}" - tell me specific program and I give you exact estimate!`;

  } else if (q.includes('fee') || q.includes('cost') || q.includes('how much')) {
    reply = `💰 KNUST Fees (2025/2026 estimate):

- Freshers Science/Eng: GHS 2,800 - 4,500 per year (Ghanaian)
- Business/Humanities: GHS 2,200 - 3,500
- Medicine/Pharmacy: GHS 4,500 - 6,000
- International students: $3,000 - $7,000 USD

Plus: Hostel, SRC dues, faculty dues ~ GHS 1,000 extra.

Pay through: KNUST student portal with Ghana.gov

Scholarships available: GNPC, GETFund, MTN Bright, Mastercard Foundation.

What program you dey ask about?`;

  } else if (q.includes('course') || q.includes('program') || q.includes('offer')) {
    reply = `🎓 KNUST Has 100+ Programs:

Top Colleges:
1. Engineering: Civil, Electrical, Mechanical, Chemical, Petroleum, Aerospace, etc
2. Science: Computer Science, Biochemistry, Actuarial Science, Statistics, Maths
3. Health: Medicine, Pharmacy, Nursing, Midwifery, Med Lab
4. Business: Business Admin, Accounting, Banking & Finance
5. Art & Built Env: Architecture, Real Estate, Planning
6. Agriculture: Agribusiness, Animal Science

Most popular: Computer Science, Medicine, Business Admin, Electrical Eng, Civil Eng.

Which course you interested in? Tell me!`;
  } else {
    reply = `Yo! I'm CampusAI - your KNUST guide from Kumasi! 🇬🇭

You asked: "${message}"

Quick answer: KNUST is Kwame Nkrumah University of Science and Technology, top science/tech school in Ghana, located in Kumasi.

I can help with:
• 📚 Cut-off & admissions
• 🏠 Hostels in Ayeduase/Kotei/Bomso
• 💰 Fees & scholarships
• 🎓 Courses & requirements
• 🗺️ Campus life

Ask me anything specific! Like "cut-off for computer science" or "hostel price in Kotei"`;
  }

  return res.status(200).json({ reply });
}
