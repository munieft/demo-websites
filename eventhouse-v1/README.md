# Eventhouse Marquee — Website

A multi-page, animated website for **MARQUEE HIRE by eventhouse.marquee**.
Built with plain **HTML, CSS and JavaScript** — no frameworks, no build step.
Just upload the files to any web host and it works.

---

## ⭐ First thing to do — add your WhatsApp number

Open **`js/config.js`** and set your WhatsApp number (international format,
digits only — no `+`, spaces or leading `0`):

```js
whatsapp: "44XXXXXXXXXX",   // e.g. UK 07123 456789  ->  "447123456789"
```

Every WhatsApp button on the site (header, hero, floating button, footer and
the contact form) uses this one value. Until it is set, the buttons open a
link that simply says the number isn’t on WhatsApp — they will **not** dial
anyone.

While you’re in that file you can also update the email, address, rating,
review count, social links and the default WhatsApp message — everything is
in one place.

---

## Pages

| File | Page |
|------|------|
| `index.html`   | Home |
| `about.html`   | About Us |
| `marquees.html`| Marquees & Sizes |
| `extras.html`  | Furniture & Extras |
| `gallery.html` | Gallery (filterable + lightbox) |
| `contact.html` | Contact (enquiry form + map) |

## Folder structure

```
eventhouse-marquee/
├── index.html, about.html, marquees.html, extras.html, gallery.html, contact.html
├── css/
│   ├── root.css      → design tokens (colours, fonts), reset, buttons
│   └── main.css      → header, hero, components, gallery, footer, animations
├── js/
│   ├── config.js     → YOUR BUSINESS DETAILS (edit this)
│   ├── main.js       → nav, scroll animations, counters, slider, FAQ, form
│   └── gallery.js    → gallery filtering + lightbox
├── assets/img/
│   ├── favicon.svg / favicon-32.png / favicon-180.png
│   ├── logo-mark.svg → the marquee logo (scalable)
│   ├── gallery/      → full-size photos (used in the lightbox)
│   ├── thumb/        → gallery thumbnails (faster grid loading)
│   └── hero/         → wide banner images
└── README.md
```

## How to publish

- **Any host works** — Netlify, Vercel, GitHub Pages, cPanel, or a normal web
  server. Upload the whole folder and point your domain at it.
- To preview locally, just open `index.html` in a browser. (The Google Map and
  Google Fonts need an internet connection to appear.)

## Editing tips

- **Colours & fonts:** change the variables at the top of `css/root.css`
  (`--pine`, `--brass`, `--coral`, `--canvas`, etc.).
- **Photos:** replace files in `assets/img/gallery/` and `assets/img/thumb/`
  keeping the same names, or add new ones and reference them in `gallery.html`.
- **Logo:** `assets/img/logo-mark.svg` (and the inline SVG in the header) can be
  swapped for your own artwork.

## A note on reviews

The Google rating (4.9) and review count (34) are shown as provided, with links
to your Google Maps listing so visitors can read the real reviews. The three
short testimonial quotes on the home page are **illustrative placeholders** —
replace them with genuine review text in `index.html` when you’re ready.

---

Built for Eventhouse Marquee · Marquee hire across London & the Home Counties.
