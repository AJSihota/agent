const REPO = 'AJSihota/agent';
const FILE_PATH = 'content.json';
const BRANCH = 'main';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  try {
    // Fetch current file to get its SHA (required by GitHub API for updates)
    const fileRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' } }
    );
    if (!fileRes.ok) {
      return res.status(500).json({ error: 'Failed to fetch current file from GitHub' });
    }
    const { sha } = await fileRes.json();

    // Commit the updated content
    const newContent = Buffer.from(JSON.stringify(req.body, null, 2)).toString('base64');
    const updateRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update site content via admin panel',
          content: newContent,
          sha,
          branch: BRANCH,
        }),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.json();
      return res.status(500).json({ error: 'GitHub API error', details: err.message });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
