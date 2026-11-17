# Cheeky Burger website

Static site with plain HTML, CSS and JavaScript. It has no build step and no framework.

## Pages
- `index.html`: home (hero, burgers, story, video reels, sides, meal deal, locations, gallery)
- `menu.html`: full menu with sticky section tabs, the meal deal and ordering options
- `events.html`: festivals and private hire, with an enquiry form that opens a pre-filled WhatsApp message to 07889 773111
- `find-us.html`: Vauxhall and Leicester Square, with maps, opening hours and a live open or closed status in London time

## Deploy
Upload the whole folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages or cPanel) and keep the folder structure as it is.
Fonts, images and videos are all stored locally in `assets/`.

## Editing
- Prices and dishes: `menu.html` (the burger prices also appear on `index.html`)
- Opening hours: the `HOURS` object in `assets/js/main.js` and the table in `find-us.html`
- Phone, WhatsApp and Instagram links: search for `447889773111` or `cheeky_burger`
