import { createClient } from '@vercel/edge-config';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Initialize Edge Config client
    const edgeConfig = createClient(process.env.EDGE_CONFIG);
    
    if (req.method === 'GET') {
      // Get all scores
      const scores = await edgeConfig.get('scores') || [];
      return res.status(200).json(scores);
    } 
    else if (req.method === 'POST') {
      // Add a new score
      const { name, country, score, timestamp } = req.body;
      
      if (!name || !score) {
        return res.status(400).json({ error: 'Name and score are required' });
      }
      
      // Get existing scores
      let scores = await edgeConfig.get('scores') || [];
      
      // Add new score
      scores.push({
        name,
        country,
        score,
        timestamp
      });
      
      // Sort by score (highest first)
      scores = scores.sort((a, b) => b.score - a.score);
      
      // Keep only top 100 scores to avoid hitting storage limits
      if (scores.length > 100) {
        scores = scores.slice(0, 100);
      }
      
      // Save back to Edge Config
      await edgeConfig.set('scores', scores);
      
      return res.status(201).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 