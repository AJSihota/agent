module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const AGENTS = {
    ev: { agentId: 'agent_fc7681e9e281b22c1bb5fc0d51', apiKey: 'key_1b8137d217c71c42b6717a91c7eb' },
    crypto: { agentId: 'agent_28b6ada229594961365d2826f0', apiKey: 'key_1b8137d217c71c42b6717a91c7eb' },
    hvac: { agentId: 'agent_5bfd40867f73fb1c2337c01185', apiKey: 'key_55d4df3050d36c800ece6499a2ba' },
    alice: { agentId: 'agent_38fa4616fd620f15f25d6880ee', apiKey: 'key_c5bb6259da114f3f7d5665a0768b' },
    dining: { agentId: 'agent_cc5e4d539dfc151b97f30e0ce2', apiKey: 'key_1b8137d217c71c42b6717a91c7eb' },
    parking: { agentId: 'agent_a9175013bdf9911cd3d9b554b7', apiKey: 'key_1b8137d217c71c42b6717a91c7eb' },
    property: { agentId: 'agent_1d41a8868b19d7e6adec21df93', apiKey: 'key_1b8137d217c71c42b6717a91c7eb' },
    airtravel: { agentId: 'agent_8496c7a1b4751907fa838073e0', apiKey: 'key_1b8137d217c71c42b6717a91c7eb' },
  };
  const demo = (req.body && req.body.demo) || 'hvac';
  const config = AGENTS[demo];
  if (!config) {
    return res.status(400).json({ error: 'Demo "' + demo + '" is not configured yet' });
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
