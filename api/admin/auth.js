module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Admin password not configured' });
  }
  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.status(200).json({ ok: true });
};
