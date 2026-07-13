# AIR — AI by Revolut (landing page clone)

An educational recreation of Revolut's [AIR landing page](https://www.revolut.com/air-ai-by-revolut/), built as a single static page with no frameworks or build step.

> **Disclaimer:** This project is not affiliated with, endorsed by, or connected to Revolut Ltd or any Revolut group company. It exists purely as a front-end design/development exercise. No financial services are offered. Revolut trademarks and product names belong to their respective owners. Longer copy and legal text have been paraphrased or replaced, and Revolut's proprietary videos/imagery are recreated with original CSS/SVG animations.

## What's replicated

- **Sticky nav** with blur backdrop, Personal/Business/Kids & Teens/Company links, and a mobile hamburger menu
- **Hero** — "Ask, and AIR makes it happen" with the five use-case tabs from the real page (Holiday budgeting, Travel essentials, Portfolio performance, Card controls, Subscription management). Instead of Revolut's demo videos, each tab drives a **live animated chat** inside a CSS phone mockup, with typing indicators and rich result cards. Tabs auto-rotate every 14s until you click one.
- **"Enter a new era of money intelligence"** — how to open AIR in the app (swipe down, or Profile → Chats → AIR)
- **"Chat with AIR, securely"** — security/zero-data-retention section
- **CTA banner** — "Sign up with Revolut for your chance to experience AIR"
- **Plan cards** — Standard (Free), Plus (£3.99), Premium (£7.99), Metal (£14.99), Ultra (£55)
- **Full footer** — all link columns from the real page (Plans, Accounts, Smart Spending, Investments, Crypto, Global Finances, Mobile & Connectivity, Revolut AI, Help, Security & Protection) plus legal area
- Dark theme, responsive down to mobile

## Run it

No build needed — it's plain HTML/CSS/JS:

```sh
# any static server works, e.g.
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just open `index.html` in a browser.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and content |
| `styles.css` | All styling (dark theme, phone mockup, responsive rules) |
| `script.js` | Chat scenario engine, tab switching/auto-rotate, nav + mobile menu |
