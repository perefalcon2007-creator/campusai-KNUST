export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'Type a message first' });

    const prompt = `You are CampusAI, a friendly KNUST expert guide from Kumasi. Question: ${message}. Answer short, helpful, mention Ghana context.`;

    // Try free AI - Method 1
    const aiRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
      method: 'GET',
    });

    let reply = await aiRes.text();
    
    if (!reply || reply.length < 5) {
      reply = `KNUST is Kwame Nkrumah University of Science and Technology in Kumasi, Ghana! It's Ghana's top science and tech university. For "${message}" - The best place to check is the official KNUST portal: apps.knust.edu.gh - but I can tell you general info: Cutoffs for science programs are usually 08-15, hostels in Ayeduase cost GHS 3000-6000 per year. What specific info you want?`;
    }

    return res.status(200).json({ reply: reply.substring(0, 1000) });

  } catch (e) {
    console.log(e);
    return res.status(200).json({ 
      reply: `Yes! KNUST means Kwame Nkrumah University of Science and Technology. It's in Kumasi, Ghana's best university for science/tech. 

For your question "${req.body?.message}", here's quick answer:
- Full name: Kwame Nkrumah University of Science and Technology
- Location: Kumasi, Ashanti Region
- Best for: Engineering, Science, Medicine, Business
- Ask me about: cut-off, hostels in Ayeduase/Kotei, fees, courses!

What else you want know?` 
    });
  }
}
