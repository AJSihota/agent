// Separate endpoint for external embeds (Squarespace, etc.)
// Mirrors create-call.js but with CORS headers so cross-origin requests work.
// Keep agent IDs and API keys in sync with create-call.js when updating.

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const AGENTS = {
    ev: { agentId: process.env.RETELL_AGENT_EV_EMBED, apiKey: process.env.RETELL_API_KEY },
    crypto: { agentId: process.env.RETELL_AGENT_CRYPTO, apiKey: process.env.RETELL_API_KEY_EMBED },
    hvac: { agentId: process.env.RETELL_AGENT_HVAC, apiKey: process.env.RETELL_API_KEY_EMBED },
  };
  const demo = (req.body && req.body.demo) || 'hvac';
  const config = AGENTS[demo] || AGENTS.hvac;
  try {
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + config.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ agent_id: config.agentId })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to create call' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
