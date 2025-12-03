import type { Handler } from '@netlify/functions';

// Simulation simple - en production, il faudrait une vraie DB
const messages: any[] = [];

export const handler: Handler = async (event, context) => {
  // Configuration CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'DELETE') {
      const { adminCode } = JSON.parse(event.body || '{}');
      
      // Vérification du code secret côté serveur
      if (adminCode !== "Tomtom") {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'Code administrateur incorrect' }),
        };
      }
      
      // Vider les messages
      messages.length = 0;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Chat vidé avec succès', count: 0 }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Error in clear API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
