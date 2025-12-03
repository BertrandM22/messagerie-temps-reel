import type { Handler } from '@netlify/functions';

// Simulation simple - en production, il faudrait une vraie DB
const messages: any[] = [];

export const handler: Handler = async (event, context) => {
  // Configuration CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(messages),
      };
    }

    if (event.httpMethod === 'POST') {
      const { content, userId, username } = JSON.parse(event.body || '{}');
      
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
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(newMessage),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Error in messages API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
