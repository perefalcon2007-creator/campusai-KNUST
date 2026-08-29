export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GROQ_KEY = process.env.GROQ_API_KEY;
  const msg = (req.body.message || "").trim();
  const q = msg.toLowerCase();

  // --- SPECIFIC HOSTEL DATABASE - real 2025/26 prices ---
  const HOSTELS = {
    shepherdsville: { name: "Shepherdsville (Ayeduase)", "4-in-1": 4000, "3-in-1": 5000, "2-in-1": 6000, "single": 9200, note: "With TV & Fridge, includes utilities", location: "Plot 4 Block T Ayeduase/Kotei Road" },
    victory: { name: "Victory Tower / Victory Towers (Ayeduase)", "4-in-1": 9000, "3-in-1": 10000, "2-in-1": 14000, "single": 20000, "single_std": 15000, "single_exec": 19000, note: "Most expensive, luxury, CCTV, generator, Rent Control inspected 2025", },
    kairos: { name: "Kairos Chronos", "2-in-1": 10000, "3-in-1": 8000, "1-in": 15000, "exec": 19000, note: "Premium, often quoted together with Victory" },
    liendavel: { name: "Liendavel Hot Hostel", "3-in-1": 9500, "2-in-1": 13000, "single": 20000, note: "Rent Control 2025: 20k single, 13k double" },
    republic: { name: "Republic Hall (Repuba) - Traditional", price: 2167.8, type: "Traditional Hall - Male hall, on campus, Govt price frozen", includes: "Light, water, wifi, bed", eligibility: "Mostly Level 100s" },
    unity: { name: "Unity Hall (Conti) - Traditional", price: 2167.8, type: "Traditional - Largest hall, male", },
    africa: { name: "Africa Hall - Traditional", price: 2167.8, type: "Traditional - Female hall" },
    queendom: { name: "Queens Hall - Traditional", price: 2167.8, type: "Traditional - Female" },
    independence: { name: "Independence Hall - Traditional", price: 2167.8, type: "Traditional - Mixed" },
    brunei: { name: "Brunei Complex / GUSSS", "4-in-1": 5525, "3-in-1": 6610, "2-in-2": 7245, "2-in-1": 8470, note: "GUSSS official 2024/25, pay via GCB/Ecobank reservation code" },
  };

  // Detect specific hostel
  let specificData = null;
  let contextPrompt = "";
  for (const key in HOSTELS) {
    if (q.includes(key) || (key==="queendom" && q.includes("queen")) || (key==="republic" && q.includes("repu"))) {
      specificData = HOSTELS[key];
      contextPrompt = `USER ASKED SPECIFICALLY ABOUT: ${specificData.name}. DATA: ${JSON.stringify(specificData)}. You MUST answer only about this hostel with its exact prices PER YEAR. Don't give generic list.`;
      break;
    }
  }

  // If asks "traditional only" -> give only traditional
  if (q.includes("traditional") &&!specificData) {
    contextPrompt = `User wants ONLY traditional halls. Answer: All traditional halls cost GHS 2,167.80 per YEAR (frozen govt price). List: Unity, Africa, Independence, Queens, Republic, University Hall (Katanga). Includes light/water/wifi. For freshers. Don't talk about private hostels unless asked.`;
  }

  // Try AI with specific context (flexible, not rigid)
  if (GROQ_KEY) {
    const MODELS = ['openai/gpt-oss-20b', 'llama-3.1-8b-instant', 'llama3-70b-8192'];
    for (const model of MODELS) {
      try {
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            temperature: 0.4,
            max_tokens: 700,
            messages: [
              { role: 'system', content: `You are CampusAI, a smart KNUST senior in Kumasi. You have logic, don't just quote prices.

CORE KNOWLEDGE:
- Traditional Halls (Unity, Republic, Africa, Queens, Independence, Katanga): GHS 2167.80 PER ACADEMIC YEAR. Why frozen? They are PUBLIC halls owned by KNUST/Government. Under Ghana Fees & Charges Act and GTEC rules, public university residential fees need Parliament approval to increase sharply. Govt kept it low for affordability. Includes light, water, wifi, bed. Mostly for Level 100s via portal.
- Private Hostels (Ayeduase/Kotei): Business owned. Prices 2000-20000 per YEAR. Shepherdsville: 4-in-1 4000, 3-in-1 5000, 2-in-1 6000, Single 9200 with TV/fridge. Victory Towers: 4-in-1 9000, 3-in-1 10000, 2-in-1 14000, Single 20000 (luxury, generator, CCTV). Brunei (GUSSS): 5525-8470.
- Difference: Traditional = cheap, on campus, govt regulated, shared, no frills. Private = expensive, off campus (Ayeduase 5-15min), more privacy, self-contain options, utilities often extra 500-1000.

INSTRUCTION: If user asks WHY, HOW, DIFFERENCE, explain logically using above. Don't say "try again". Be conversational, Ghanaian vibe small. Always say PER YEAR (8-10 months).

${contextPrompt}` },
              { role: 'user', content: msg }
            ]
          })
        });
        const data = await r.json();
        if (r.ok) return res.status(200).json({ reply: data.choices[0].message.content });
      } catch(e){ continue; }
    }
  }

  // Fallback if no key or AI fails - still specific
  if (specificData) {
    return res.status(200).json({ reply: `${specificData.name} real price 2025/26 PER YEAR:\n${JSON.stringify(specificData, null, 2)}\nNote: Ask if utilities included.` });
  }
  return res.status(200).json({ reply: "CampusAI here! Traditional halls GHS 2,167.80/year. Private: Shepherdsville 4k-9.2k, Victory/Kairos 8k-20k per year. Tell me which hostel name exactly?" });
}
