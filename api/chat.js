export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method!== 'POST') return res.status(405).json({reply:'Method not allowed'});

  const { message } = req.body;
  const key = process.env.GEMINI_KEY;

  if (!key) {
    return res.status(200).json({ reply: 'ERROR: GEMINI_KEY is missing in Vercel env vars' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are CampusAI, KNUST expert from Kumasi. Answer friendly in Ghanaian style about: ${message}` }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `GEMINI API ERROR: ${data.error.message}. Your key may be invalid. Key starts with ${key.substring(0,4)}` });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply from Gemini';
    return res.status(200).json({ reply });

  } catch (e) {
    return res.status(200).json({ reply: 'Fetch Error: ' + e.message });
  }
}
