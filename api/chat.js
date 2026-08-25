export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'No message' });

    const systemPrompt = `You are CampusAI, expert KNUST guide. You know: all programs and cutoffs (e.g. Computer Science ~ 8-12, Medicine ~ 6-8), halls (Unity, Katanga, Africa, Independence, Queens etc), hostels in Ayeduase/Kotei/Bomso, fees, scholarships, course registration, exam tips. Answer short, friendly, with some Ghanaian slang. If you don't know exact current cutoff, give estimate and say to check official KNUST admission portal.`;

    const response = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || data.content || "Chale, network slow, try again.";

    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ reply: "Boss, error - " + e.message });
  }
}
