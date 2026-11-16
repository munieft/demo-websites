# Snack Bar Dagenham — Website

A static multipage website built with plain HTML, CSS and JavaScript. It has no frameworks and no build step.

## Pages
- `index.html`: Home. Has the hero, a live open/closed clock (UK time), signature plates, coffee, fun drinks, cheesecakes and the regulars.
- `menu.html`: The full menu. It has sticky category tabs and live search. Items live in `assets/js/menu-data.js`.
- `story.html`: Our Café. Covers the values, "a day at Snack Bar" and Mutley.
- `gallery.html`: A filterable photo and video gallery with a lightbox (keyboard and swipe).
- `visit.html`: Hours (today is highlighted), contact details, a Google Map, getting here, and an order form that opens WhatsApp.

## Deploy
Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, cPanel, etc.). `index.html` is the entry point.

## Editing
- Opening hours: `BIZ.hours` in `assets/js/main.js`, plus the text in each page footer.
- Menu items: `assets/js/menu-data.js`. You can add a `price: "£x.xx"` field and show it in the template in `main.js` if wanted.
- Phone numbers: 020 8593 7291 (café) and 07578 138728 (mobile/WhatsApp).
