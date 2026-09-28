# BadgerLabs AI

Voice agents for every industry. 24/7 call answering, lead qualification, and appointment booking.

## 🦡 About

BadgerLabs AI is an AI voice agent platform targeting service businesses in British Columbia and beyond. Named after the honeybadger — relentless, unstoppable, never gives up.

## 🎯 Features

- **Industry-specific demos** for HVAC, Plumbing, Roofing, Real Estate, Medical, Automotive
- **Starlink-inspired design** — dark, sleek, space-tech aesthetic
- **Handshake-style showcase** — demo cards for each industry
- **Calendly integration** for booking consultations
- **Retell AI demo** integration

## 🚀 Deployment

### Vercel (Recommended)

Secrets are never committed. Set them in Vercel → Project → Settings → Environment Variables (tick Production and Preview), then redeploy — changes only apply to new deployments.

| Variable | Used by |
|---|---|
| `RETELL_API_KEY_DEMOS` | `/api/create-call`: ev, crypto, dining, parking, property, airtravel |
| `RETELL_API_KEY_HVAC` | `/api/create-call`: hvac · `/api/create-call-embed`: ev |
| `RETELL_API_KEY_ALICE` | `/api/create-call`: alice · `/api/create-call-embed`: crypto |
| `RETELL_API_KEY_HVAC_EMBED` | `/api/create-call-embed`: hvac |
| `ADMIN_PASSWORD` | `/admin` sign-in |
| `GITHUB_TOKEN` | `/admin` publishing (commits `content.json`) |

Each Retell key must belong to the Retell workspace that owns the agents listed next to it.

```bash
cd /data/.openclaw/workspace/badgerlabs-ai
vercel --prod
```

### Manual

Upload `index.html` to any static hosting (Netlify, GitHub Pages, etc.)

## 📝 Customization

### Update Demo Links

Edit `index.html` and replace the demo URLs:

```html
<a href="YOUR_HVAC_DEMO_URL" class="demo-btn">
```

### Update Calendly

Replace all instances of `https://calendly.com/ajaysihota23/30min` with your booking link.

### Add Logo

Replace the emoji logo with an actual image:

```html
<div class="logo-icon">
    <img src="logo.png" alt="BadgerLabs" width="32" height="32">
</div>
```

## 🔗 Links

- **Demo:** https://retell-demo-rosy.vercel.app
- **Calendly:** https://calendly.com/ajaysihota23/30min
- **Based on:** agenteasy.co

---

Built for BadgerLabs AI — British Columbia 🇨🇦
