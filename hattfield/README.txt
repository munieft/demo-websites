HATFIELD COMMUNITY HALL — WEBSITE PACKAGE
===========================================

WHAT'S INSIDE
-------------
index.html      Home
about.html      Our Story
hire.html       Hire the Hall
gallery.html    Gallery
contact.html    Find & Contact Us (enquiry form + map)

assets/css/style.css   All styling
assets/js/main.js      Mobile menu, gallery lightbox, enquiry form behaviour
assets/img/            Your three photos, optimised for web

This is a plain, static site — no build step, no server-side code,
no database. Any standard web host (or a temporary preview link)
can serve these files as they are.

HOW TO PREVIEW LOCALLY
-----------------------
Open index.html directly in a browser, or, for the most accurate
preview (some browsers restrict local file access), run a tiny
local server from inside this folder:
    python3 -m http.server 8000
then visit http://localhost:8000/

HOW TO PUT IT LIVE
-------------------
Upload the whole folder (keeping the "assets" folder and its
sub-folders exactly as they are) to any host — e.g. Netlify,
Vercel, GitHub Pages, or standard cPanel hosting. index.html is
the homepage.

THINGS TO CHECK / CUSTOMISE BEFORE GOING LIVE
------------------------------------------------
1. Hire rates: the Hire page currently invites people to ask for a
   quote, since no fixed price list was supplied. Add real prices
   if you have them.
2. Opening/booking hours: contact.html currently says "available
   by arrangement" — replace with fixed hours if the hall has them.
3. The enquiry form on contact.html opens the visitor's email app
   pre-filled with their details (no server required). If you'd
   rather receive submissions directly, this can be swapped for a
   form service such as Formspree, Netlify Forms, or a simple
   backend — ask and this can be wired up.
4. Logo: there's no existing logo, so a simple gable-roof mark in
   brick red and hedge green was designed to sit next to the hall's
   name (see the top-left of every page). It's built as inline SVG,
   so it stays sharp at any size and costs nothing to load. Swap it
   for a commissioned logo whenever you're ready — it only needs to
   be dropped into the LOGO_SVG block used across the pages.
5. Google review score (4.4 / 75 reviews) and the short quote in the
   "rated" section on the homepage were taken from your public
   listing — update these from time to time so they stay current.

DESIGN NOTES
------------
Colours and type were taken from the hall itself rather than a
generic template: the brick red of the boundary walls, the hedge
green of the dado rail and garden, and a warm parchment background.
Headings use "Fraunces" (a warm serif with some character); body
text uses "Public Sans" (a clean, civic-feeling sans-serif) — both
load free from Google Fonts.
