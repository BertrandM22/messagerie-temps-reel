import type { VercelRequest, VercelResponse } from '@vercel/node';

// Variables globales pour simuler une base de données
let messages: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.json(messages);
  } else if (req.method === 'POST') {
    const { content, userId, username } = req.body;
    
    const newMessage = {
      id: messages.length + 1,
      content: content,
      userId: userId,
      username: username || "Utilisateur anonyme",
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      })
    };
    
    messages.push(newMessage);
    res.json(newMessage);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
