21 SID Tarot & Coffee: website
==============================

Plain HTML, CSS and JavaScript. No framework, no build step, no server code.
Upload the whole folder to any static host (Netlify, Cloudflare Pages,
GitHub Pages, cPanel) and index.html is the home page.

Pages
  index.html   Home, with the pull-a-card game
  menu.html    Drinks board, all-day food, the counter, shelf and bar
  tarot.html   Readings, classes, courses, creative nights
  laura.html   About Laura Lo Faro
  visit.html   Hours, map, venue hire, message form, photo gallery

Things you will want to edit
  Opening hours   assets/js/main.js, the HOURS list near the top (drives the
                  open/closed badge), plus the tables in visit.html, index.html
                  and the footer of each page.
  Dated events    assets/js/main.js, the EVENTS list. Past events hide
                  themselves automatically.
  Menu prices     menu.html.
  WhatsApp number assets/js/main.js (WA) and the wa.me links in the pages.

Fonts are self-hosted in assets/fonts (Bodoni Moda, Anton, Instrument Sans,
all SIL Open Font License). The map on visit.html is an OpenStreetMap embed
and needs an internet connection.
