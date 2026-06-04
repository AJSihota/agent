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
  const message = `authorization:github:${status}:${content}`;
  // Post directly to the opener and close — avoids depending on the
  // two-step handshake which breaks when GitHub's COOP header nulls window.opener.
  return `<!DOCTYPE html><html><body><script>
    (function () {
      var msg = ${JSON.stringify(message)};
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(msg, '*');
      }
      window.close();
    })();
  </script></body></html>`;
}
