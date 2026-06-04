module.exports = async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send(renderPopup('error', 'Missing OAuth code'));
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.send(renderPopup('error', tokenData.error || 'No token received'));
    }

    const payload = JSON.stringify({ token: tokenData.access_token, provider: 'github' });
    res.send(renderPopup('success', payload));
  } catch (err) {
    res.status(500).send(renderPopup('error', 'Server error during token exchange'));
  }
};

function renderPopup(status, content) {
  // Decap CMS listens for this exact postMessage format from the OAuth popup window
  const message = `authorization:github:${status}:${content}`;
  return `<!DOCTYPE html><html><body><script>
    (function () {
      function onMessage(e) {
        window.opener.postMessage(${JSON.stringify(message)}, e.origin);
      }
      window.addEventListener('message', onMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script></body></html>`;
}
