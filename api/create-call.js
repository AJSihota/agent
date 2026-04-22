module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const AGENTS = {
    ev: { agentId: 'agent_33f25d98f5585f1a4089ac7c46', apiKey: 'key_55d4df3050d36c800ece6499a2ba' },
    crypto: { agentId: 'agent_51ec9174c41daa9b8687e6095a', apiKey: 'key_55d4df3050d36c800ece6499a2ba' },
    hvac: { agentId: 'agent_5bfd40867f73fb1c2337c01185', apiKey: 'key_55d4df3050d36c800ece6499a2ba' },
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
      return res.status(response.status).json({ error: 'Retell API error', details: data });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
