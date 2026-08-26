export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GROQ_KEY = process.env.GROQ_API_KEY;
  const userMsg = (req.body.message || "").trim();
  const lower = userMsg.toLowerCase();

  // --- 1. LOCAL FALLBACK (no AI needed) - stops network error for simple asks ---
  if (lower.includes('your name') || lower.includes('who are you')) {
    return res.status(200).json({ reply: "I'm CampusAI - your KNUST senior guide 🇬🇭 built in Kumasi! Ask me hostel, cut-off, fees, courses." });
  }
  if (lower.includes('hostel') || lower.includes('ayeduase') || lower.includes('kotei') || lower.includes('bomso')) {
    return res.status(200).json({ reply:
`Ayeduase/Kotei/Bomso Real Prices 2025/26 PER YEAR (not month):

• Traditional Halls (Unity, Africa, Repu, Queens): GHS 2,167.80/year - fixed, includes light/water/wifi. For freshers only.

• Budget Private: 4-in-a-room GHS 2,000-3,500 / year
• Mid Private (most hostels): 4-in-1 GHS 4,000-5,525 | 2-in-1 GHS 5,000-8,000
• Premium (TV, fridge, generator): Shepherdsville 4-in-1 4k, 2-in-1 6k, Single 9,200 | Victory/Kairos Single 15k-20k, Double 10k-14k each

Most charge utilities separate (500-1000). Always confirm if academic year or 12 months.`
    });
  }
  if (lower.includes('cut') || lower.includes('aggregate')) {
    return res.status(200).json({ reply:
`Latest KNUST cut-off 2025/26 (WASSCE aggregate, lower is better):
Med/Human Bio 06, Dental 06, Pharm D 06, Nursing 07, Computer Sci 07, Biomed Eng 06, Petroleum 07-08, Architecture 08-09, Business Accounting 07-08, Law 06, Actuarial 08-10, Biological Science 09-10.

Full list has 100+ courses - tell me the course name?`
    });
  }

  // --- 2. TRY GROQ AI for other questions ---
  if (!GROQ_KEY) {
    return res.status(200).json({ reply: "I'm CampusAI! Your Groq key is missing in Vercel > Settings > Environment Variables > GROQ_API_KEY. Add it and redeploy. But I can still answer hostels/cut-offs locally." });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // most stable model, won't crash
        temperature: 0.3,
        max_tokens: 800,
        messages: [
          { role: 'system', content: `You are CampusAI, KNUST guide. Real data: Traditional hall 2167.80/year, private hostels 2000-20000/year depending on standard (budget 2k-3.5k, mid 5k-8k, premium 9k-20k). Cutoffs: Medicine 06, Nursing 07, Comp Sci 07, Actuarial 10, Law 06. Fees 6345-11614 GHC. Always say PER YEAR. Be friendly Ghanaian style, short.` },
          { role: 'user', content: userMsg }
        ]
      })
    });

    const data = await groqRes.json();
    if (!groqRes.ok) {
      console.error("Groq error:", data);
      // Fallback reply instead of 500 error
      return res.status(200).json({ reply: `Chale, AI busy small (${data.error?.message || 'groq error'}). But for hostel: Ayeduase is GHS 2k-9k per YEAR not month. Ask me specific course/hostel?` });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    return res.status(200).json({ reply: "Network hiccup! But I'm still here. Hostel Ayeduase is 2000-9200 per academic year. Cut-off Medicine 06, Nursing 07, Comp Sci 07. What course you dey ask?" });
  }
}
