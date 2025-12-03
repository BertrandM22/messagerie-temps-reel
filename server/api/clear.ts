import type { VercelRequest, VercelResponse } from '@vercel/node';

// Variable globale partagée (attention: sera réinitialisée à chaque déploiement)
let messages: any[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'DELETE') {
      const { adminCode } = req.body;
      
      // Vérification du code secret côté serveur
      if (adminCode !== "Tomtom") {
        return res.status(403).json({ 
          error: 'Code administrateur incorrect' 
        });
      }
      
      // Vider les messages
      messages.length = 0;
      
      res.status(200).json({ message: 'Chat vidé avec succès', count: 0 });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in clear API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
