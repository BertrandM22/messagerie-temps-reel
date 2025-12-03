import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simulation simple - en production, il faudrait une vraie DB
const users: any[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      res.status(200).json(users);
    } else if (req.method === 'POST') {
      const { name, email } = req.body;
      
      const newUser = {
        id: users.length + 1,
        name: name,
        email: email || ""
      };
      
      users.push(newUser);
      res.status(200).json(newUser);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in users API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
