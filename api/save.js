export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({error:'Only POST'});
  try{
    const { title, category, description, file } = req.body;
    if(!title) return res.status(400).json({error:'Title required'});
    const token = process.env.GITHUB_TOKEN;
    const repo = "perefalcon2007-creator/campusai-KNUST";
    const path = "resources.json";
    
    // 1. Get current file + SHA from GitHub (server side, with token = no block)
    let sha = null;
    let resources = [];
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept':'application/vnd.github.v3+json' }
    });
    if(getRes.ok){
      const getData = await getRes.json();
      sha = getData.sha;
      const contentStr = Buffer.from(getData.content, 'base64').toString('utf-8');
      try{ resources = JSON.parse(contentStr); }catch(e){ resources=[]; }
      if(!Array.isArray(resources)) resources = resources.resources || [];
    }
    
    // 2. Add new item
    const newItem = { id: Date.now(), title, category, description, file, date: new Date().toISOString() };
    resources.unshift(newItem);
    const newContent = Buffer.from(JSON.stringify(resources, null, 2)).toString('base64');
    
    // 3. Push
    const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json', 'Accept':'application/vnd.github.v3+json' },
      body: JSON.stringify({ message: `Add: ${title}`, content: newContent, sha })
    });
    const data = await putRes.json();
    return res.status(putRes.status).json(data);
  }catch(e){ return res.status(500).json({error:e.message}); }
}
