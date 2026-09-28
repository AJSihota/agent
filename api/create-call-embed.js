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
    ev: { agentId: 'agent_4c3c77a23da1f82720dd7b964a', apiKey: process.env.RETELL_API_KEY_HVAC },
    crypto: { agentId: 'agent_56ccac9d6a6ae0b6ed92c0ffe1', apiKey: process.env.RETELL_API_KEY_ALICE },
    hvac: { agentId: 'agent_5bfd40867f73fb1c2337c01185', apiKey: process.env.RETELL_API_KEY_HVAC_EMBED },
  };
  const demo = (req.body && req.body.demo) || 'hvac';
  const config = AGENTS[demo] || AGENTS.hvac;
  if (!config.apiKey) {
    return res.status(500).json({ error: 'Retell API key not configured for demo "' + demo + '"' });
  }
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
      return res.status(response.status).json({ error: 'Retell API error', details: data });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
