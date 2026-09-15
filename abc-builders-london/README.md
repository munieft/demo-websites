# ABC Builders London Ltd — Website

A premium multi-page website for ABC Builders London Ltd, built around the
brand's woven "interlock" knot logo. Static HTML/CSS/JS — no build step.

## Pages
- `index.html` — Home
- `bespoke-carpentry.html` — Bespoke Carpentry
- `kitchen-bathroom.html` — Kitchen & Bathroom
- `exterior-work.html` — Exterior Work
- `contact.html` — Contact (enquiry form + map + details)

## Run it
Open `index.html` in a browser, or serve the folder:
    python3 -m http.server 8000
then visit http://localhost:8000

## Design
- Theme: "The Interlock" — derived from the ABC woven-knot logo.
- Palette: brand orange #EE5602, charcoal #161616, warm plaster #F5F1EA.
- Type: Archivo (heavy, wide display) + Inter (body), via Google Fonts.
- Brand assets recreated as clean SVG: `assets/img/knot*.svg`, `seam.svg`.

## Going live — things to wire up
1. **Enquiry form** (`contact.html`): currently front-end only. Point it at a
   form handler (Formspree, Netlify Forms, or your own email endpoint). Search
   `id="enquiry"` in `assets/js/main.js`.
2. **Google Map**: the embed uses a name search for "ABC Builders London Ltd,
   Bromley". Swap for an official Google Maps embed URL if you have one.
3. **Credentials**: the Guild of Master Craftsmen and City & Guilds logos are
   the assets from the existing site. Keep only those you're entitled to display.
4. Replace `favicon.png` / add more sizes if desired.

## Notes
All copy and services are taken from the existing ABC Builders London material.
Nothing about the business (claims, reviews, awards, contact details) was invented.
Contact: +44 7824 886319 · info@abcbuilderslondon.com · @abc_builders_london_ltd
