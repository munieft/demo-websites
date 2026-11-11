# Wingz'N'Dat website

A static multi-page site built with HTML, CSS and vanilla JavaScript. It has no frameworks, no build step and no server code.

## Pages
- `index.html`: Home (hero, culture, signature dishes, video, catering teaser, reviews)
- `menu.html`: Full menu with an order tray that sends the order to WhatsApp (+44 7429 725554)
- `catering.html`: Services, process, past spreads, FAQs and an enquiry form (sends to WhatsApp)
- `story.html`: Founders, three-flag heritage, timeline and carnival video
- `gallery.html`: Filterable photo gallery with a lightbox (keyboard and swipe)
- `contact.html`: Order channels, delivery zone map and a contact form

## Deploy
Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, cPanel or similar). Fonts are self-hosted in `assets/fonts`, so nothing else needs installing.

## Editing
- Prices and dishes are plain HTML inside `menu.html`. Each "Add" button carries `data-add` (name) and `data-price`.
- Phone and WhatsApp numbers are set in `assets/js/main.js` (`WA`) and in the page links.
- The colour palette is in `assets/css/style.css` under `:root`.
- The logo is `assets/img/logo-mark.svg`. A transparent PNG is at `logo-mark-hd.png`.
