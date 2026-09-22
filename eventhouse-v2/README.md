# Eventhouse Marquee — Website (v2 · "After Dark" edition)

A fresh, multi-page website for **MARQUEE HIRE by eventhouse.marquee** with a
completely new direction: a dark, cinematic theme in **ink + champagne gold +
warm blush**, a custom **gold arch monogram** logo, editorial typography
(Playfair Display + Manrope), a drag-to-scroll gallery, section-index dots and
soft film-grain texture.

Built with plain **HTML, CSS and JavaScript** — no frameworks, no build step.

---

## ⭐ First: add your WhatsApp number
Open **`js/config.js`** and set your number (international format, digits only):
```js
whatsapp: "44XXXXXXXXXX",   // UK 07123 456789 -> "447123456789"
```
Every WhatsApp button and the contact form read from this one value. Until it's
set the buttons open a link that simply says the number isn't on WhatsApp — they
won't dial anyone.

## About the photography (please read)
The photos are **free stock images from [Unsplash](https://unsplash.com)**
(free to use, no attribution required). They are **hotlinked** — loaded live
from Unsplash's CDN — so the download stays small and you get real, professional
imagery instantly. An internet connection is needed to see them, and every image
has an elegant gradient fallback if one ever fails to load.

To use your **own photos** instead (recommended once you have them):
1. Drop your images into `assets/img/`.
2. In the page HTML, replace the `src="https://images.unsplash.com/..."` value
   with `src="assets/img/your-photo.jpg"`. That's it — the layout is unchanged.

You can also swap any Unsplash photo for another: replace the photo ID in the
URL (`photo-XXXX`) with a different one from unsplash.com.

## Pages
`index.html` · `about.html` · `marquees.html` · `extras.html` · `gallery.html` · `contact.html`

## Structure
```
eventhouse-v2/
├── *.html                 6 pages
├── css/
│   ├── base.css           tokens, reset, type, buttons
│   └── style.css          header, hero, components, gallery, footer, motion
├── js/
│   ├── config.js          YOUR BUSINESS DETAILS (edit this)
│   ├── app.js             nav, reveal, counters, slider, FAQ, form, drag-scroll, dots
│   └── gallery.js         gallery filtering + lightbox
├── assets/img/            logo-mark.svg, favicon.svg / .png
└── README.md
```

## Publish
Upload the whole folder to any host (Netlify, Vercel, GitHub Pages, cPanel…).
To preview locally, open `index.html` (photos, fonts and the map need internet).

## Editing tips
- **Colours & fonts:** the variables at the top of `css/base.css` (`--ink`,
  `--gold`, `--blush`, `--cream`).
- **Logo:** `assets/img/logo-mark.svg` (and the inline SVG in the header/footer).
- **Reviews:** the 4.9★ / 34 figure links to your real Google listing. The three
  testimonial quotes are illustrative placeholders — swap them for genuine review
  text in `index.html` when ready.

---
Built for Eventhouse Marquee · Marquee hire across London & the Home Counties.
