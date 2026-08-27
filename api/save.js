export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Only POST'});
  const { content, message, sha } = req.body;
  const token = process.env.GITHUB_TOKEN;
  const repo = "trey-cyber/campusai-KNUST";
  
  const r = await fetch(`https://api.github.com/repos/${repo}/contents/resources.json`, {
    method: 'PUT',
    headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: message || 'Update resources', content, sha })
  });
  const data = await r.json();
  return res.status(r.status).json(data);
}
