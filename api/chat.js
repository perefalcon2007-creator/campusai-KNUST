export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { message } = req.body;
  const key = process.env.GROQ_KEY;

  if (!key) return res.status(200).json({ reply: 'GROQ_KEY missing in Vercel env' });

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are CampusAI, expert KNUST guide from Kumasi Ghana. You know all about KNUST hostels, fees, cut-off points, admissions, WASSCE, courses, pre-med program, accommodation, campus life. Answer friendly, brief, with Ghanaian vibe.' },
          { role: 'user', content: message }
        ]
      })
    });
    const d = await r.json();
    if (d.error) return res.status(200).json({ reply: 'GROQ ERROR: ' + d.error.message });
    return res.status(200).json({ reply: d.choices[0].message.content });
  } catch (e) {
    return res.status(200).json({ reply: 'Error: ' + e.message });
  }
}
