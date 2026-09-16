# Bouncy Billz — Website

A fun, multi-page marketing site for **Bouncy Billz**, an epic bouncy castle hire
business in Newham, East London. Built as plain, structured HTML/CSS/JS — no build
step, no framework, no server code. Just upload the folder to any static host.

## What's inside

```
bouncy-billz/
├── index.html          # Home
├── castles.html        # Our Castles (the collection + extras + sizing)
├── about.html          # About, safety, service area + map
├── contact.html        # Enquiry form, contact details, socials, map, FAQ
├── css/
│   └── styles.css      # All styling + design tokens (one place to re-theme)
├── js/
│   └── main.js         # Mobile nav, scroll reveals, confetti, enquiry form
├── images/             # Real photos + logo + generated favicons
│   ├── logo.jpg
│   ├── castle-party-time.webp
│   ├── castle-star.webp
│   └── favicon-*.png
└── assets/             # Reusable SVG graphics (icons, illustrated castles, decor)
    ├── icons.svg           # icon sprite (referenced via <use>)
    ├── balloons.svg, bunting.svg, sunburst.svg, wave-top.svg
    └── castle-superhero.svg, castle-princess.svg, castle-jungle.svg
```

## Brand / theme

Colours and fonts are taken straight from the logo (superhero-bounce, primary
palette). Everything is driven by CSS variables at the top of `css/styles.css`:

- Sky blue `#2cb5e8`, hero blue `#1b3a8f`, hero red `#e63329`, gold `#fdb726`,
  green accent `#3aa655`, ink/navy `#14204a`.
- Headings: **Fredoka** · Body: **Nunito** (loaded from Google Fonts).

To re-theme, change the `:root` tokens — the whole site follows.

## Hosting

It's a static site, so it works on Netlify, Vercel, GitHub Pages, Cloudflare Pages,
or any web host. Drag-and-drop the whole folder, or point the host at it. `index.html`
is the entry page.

> Note: the map on the About/Contact pages loads from OpenStreetMap and needs an
> internet connection at view time (it renders once hosted online).

## Things to update before going live

- **Testimonials** on the home page are realistic placeholders — swap them for real
  Google reviews when ready.
- **Castle sizes / ages** are sensible examples; adjust to the real fleet.
- The three illustrated castles (Superhero HQ, Princess Palace, Jungle Adventure) are
  SVG placeholders — replace with real photos as they're taken.
- The enquiry form opens the visitor's email app pre-filled to `bouncybillz@gmail.com`
  (no backend needed). For direct-to-inbox submissions, connect a form service
  (Formspree, Netlify Forms, etc.).

## A note on "protecting" the code

This is shared as a structured project (separate HTML/CSS/JS/asset files) rather than
one giant copy-paste page. That makes it far less convenient to grab in one click.
Do be aware, though, that **any** website's front-end files are technically viewable
in the browser once it's live — that's true of every site on the internet. The real
protection for a preview is simply sharing a temporary link and not handing over the
project files until you're ready.

Contact: bouncybillz@gmail.com · WhatsApp +44 7914 621810
