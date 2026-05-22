module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const AGENTS = {
    ev: { agentId: process.env.RETELL_AGENT_EV, apiKey: process.env.RETELL_API_KEY },
    crypto: { agentId: process.env.RETELL_AGENT_CRYPTO, apiKey: process.env.RETELL_API_KEY },
    hvac: { agentId: process.env.RETELL_AGENT_HVAC, apiKey: process.env.RETELL_API_KEY },
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
