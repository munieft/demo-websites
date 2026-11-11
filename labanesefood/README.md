# Lebanese Food — website

Static, multi-page website for Lebanese Food, 13 Skylines Village, Limeharbour, London E14 9TS.
Plain HTML, CSS and JavaScript. No frameworks, no build step and no server code.

## Pages
- `index.html` — Home: animated hero with rising embers and festoon lights, signature dishes, "how a box is built" video, culture teaser, rating counters, find-us card
- `menu.html` — Full menu from the truck boards (Grill, Salad Box, Chips, Vegetarian) with a Medium/Large switch and an order tray that sends the order to WhatsApp
- `story.html` — Our Story & culture: the corner grill, the cedar on the badge, the sufra (shared table), promises and a Lebanese food glossary
- `gallery.html` — Filterable photo and video gallery with a full-screen lightbox (keyboard and swipe)
- `visit.html` — Address, directions, call/WhatsApp, opening-hours link, event & catering enquiry (composed for WhatsApp) and FAQ

## Going live
Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages or ordinary web hosting). Open `index.html` locally to preview.

## Editing
- Menu items and prices: the `MENU` list near the middle of `assets/js/main.js`
- WhatsApp / phone number: `WA` at the top of `assets/js/main.js`
- Colours and fonts: the `:root` block at the top of `assets/css/style.css`
- Photos: `assets/img/` (each photo has a full-size and a `-sm` version)
