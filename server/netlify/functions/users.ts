import type { Handler } from '@netlify/functions';

// Simulation simple - en production, il faudrait une vraie DB
const users: any[] = [];

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
        body: JSON.stringify(users),
      };
    }

    if (event.httpMethod === 'POST') {
      const { name, email } = JSON.parse(event.body || '{}');
      
      const newUser = {
        id: users.length + 1,
        name: name,
        email: email || ""
      };
      
      users.push(newUser);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(newUser),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Error in users API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
