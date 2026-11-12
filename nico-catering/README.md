# Nico Catering Ltd — Website

Static multipage website: HTML, CSS and vanilla JavaScript only (no React, no Python, no build step).
Upload the whole folder to any web host (Netlify, Vercel, cPanel, GitHub Pages, etc.).

## Pages
- index.html: Home
- menu.html: Full menu with filters, search and the "Your spread" builder
- occasions.html: Weddings, christenings, funerals and Nine Nights, corporate, festivals, birthdays, private, mobile
- story.html: Culture, heritage and community
- gallery.html: Photos and videos with lightbox
- contact.html: Quote form (sends via WhatsApp or email), contact details, map, FAQ
- 404.html

## How the quote form works
There is no server. The form composes the enquiry (including any dishes picked on the menu)
and opens WhatsApp (+44 7521 078492) or the visitor's email app (nicolsonray@icloud.com), ready to send.
To change the number or email, edit `WA` and `EMAIL` at the top of js/main.js and the links in the HTML.

## Brand
- assets/logo/: redrawn logo suite (SVG + PNG): main lockup on black and ivory, mono, round badges, icon/favicon
- Palette: Ink #100E0C · Patty Gold #C99A2E / #E9C46A · Yard Green #0D3A2B · Ivory #F4EDE0 · Scotch Bonnet #C4391F
- Fonts (self-hosted in assets/fonts): Bodoni Moda (display), Jost (text), Pinyon Script (script), Cormorant Garamond (accent)
