export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: 'No message' });
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY missing in Vercel' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'groq/compound',
        messages: [
          {
            role: 'system',
            content: `You are CampusAI - KNUST student helper in Ghana.

RULES:
1. Always search the web for current info before answering.
2. For hostel prices: ALWAYS give price PER ACADEMIC YEAR (not per month). Real Ayeduase range is GHC 2,000 - 4,200 per year (4-in-a-room ~2000-2500, 2-in-a-room ~3000-3500, single ~4000-4200). If web says monthly, convert to yearly x10 months. Never say 900 per month.
3. If web has no result, say "Check KNUST Student Services or hostel office for latest 2024/2025 price, but typical range is 2000-4200/year".
4. Be short, friendly, use GHC.
5. You are not official KNUST admin.
`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.3
      })
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      return res.status(500).json({ error: data.error?.message || 'Groq error', details: data });
    }

    const answer = data.choices[0]?.message?.content || 'No answer';
    return res.status(200).json({ reply: answer });

  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
