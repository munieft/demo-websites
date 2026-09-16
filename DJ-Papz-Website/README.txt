DJ PAPZ — WEBSITE
=================

A premium one-page site for DJ Papz (wedding & event DJ, North London).

HOW TO PREVIEW / HOST
---------------------
This is a static site — no server, no database, no build step needed.

Local preview:
  Open a terminal in this folder and run any static server, e.g.
      npx serve .
  then open the printed http://localhost:... address.
  (Opening index.html directly also works, but a server is closer to real hosting.)

Temporary / shareable hosting (drag-and-drop the WHOLE folder):
  - Netlify Drop      → https://app.netlify.com/drop
  - Vercel            → vercel deploy
  - Cloudflare Pages  → direct upload
  - GitHub Pages      → push the folder to a repo

Keep the folder structure intact — index.html expects /css, /js and /assets
next to it.

STRUCTURE
---------
  index.html            The page
  css/styles.css         Styling (minified)
  js/main.js             Interactions: menu, gallery lightbox,
                         scroll reveals, WhatsApp enquiry builder (minified)
  assets/img/*.jpg       Photos
  assets/video/reel.mp4  Hero background clip (+ poster)
  assets/logo.svg        Gold emblem  |  favicon.svg  Browser icon

EDITABLE DETAILS
----------------
  WhatsApp number ...... js/main.js  (WA_NUMBER) and index.html (wa.me links)
  Instagram ............ index.html  (@papz.beesounds links)
  Reviews / copy ....... index.html
  Colours .............. css/styles.css  (:root variables at the top)

The enquiry form has no backend by design — it opens WhatsApp with the
visitor's details pre-filled, so nothing can get lost and there's nothing to
maintain.
