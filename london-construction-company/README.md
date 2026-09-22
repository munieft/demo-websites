# London Construction Company — Website

A structured, multi-page website for **London Construction Company (Toms-Arbel Ltd)** —
a bespoke design-and-build studio in Hackney, East London.

## What's here

```
/
├── index.html          Home
├── work.html           Portfolio (filterable + lightbox)
├── services.html       Services + approach + process
├── about.html          Studio story (with on-site videos)
├── contact.html        Enquiry form (routes to WhatsApp) + map
├── 404.html            Not-found page
├── robots.txt
├── site.webmanifest
└── assets/
    ├── css/style.css       Design system (one stylesheet, all pages)
    ├── js/
    │   ├── data.js         All content: projects, services, process, quotes
    │   └── main.js         Behaviour: nav, hero, portfolio, lightbox, form…
    ├── fonts/              Self-hosted Jost + Cormorant Garamond (woff2)
    ├── img/                Optimised WebP photography + favicons + posters
    └── video/             Compressed brand film + two on-site clips
```

## How to view / host

This is a static site. To preview locally, run a small web server from this
folder (opening the files directly with `file://` will block the fonts and the
dynamic portfolio):

```bash
# Python
python3 -m http.server 8080
# then open http://localhost:8080
```

For a temporary shareable link, drag this whole folder into a static host
(Netlify Drop, Vercel, Cloudflare Pages, GitHub Pages, etc.).

## Editing the content

Almost all copy and every project lives in **`assets/js/data.js`** — change the
text there, or add a new object to the `projects` array (with a matching image
in `assets/img/`) and it appears on the site automatically. No build step.

## Notes

- **Design direction** was drawn from the actual portfolio (moody, material-rich
  interiors) rather than the logo alone: a cinematic charcoal palette, plaster/bone
  light sections and a single antique-brass accent, with type (Jost) chosen to
  echo the real wordmark.
- **The enquiry form** has no server. It composes a pre-filled WhatsApp message
  from the fields and opens it, so it works on any host with no backend. If you'd
  like a form that emails you instead, that needs a form service or a small backend.
- **Trust points** on the home page (e.g. "in-house team") and the sample
  **testimonials** in `data.js` are placeholder copy — please confirm or replace
  them with your real wording before going live.
- **Rating (4.9) and review count (65)** are taken from the details you supplied.

## About protecting the source

The site is split across many external files (HTML, CSS, JS, data, media) and the
portfolio is rendered dynamically from `data.js`, so there is no single page a
viewer can copy to get everything. Please note, though, that any purely static
website's files can ultimately be downloaded from the browser — genuine source
protection requires server-side rendering or a login. This structure raises the
bar for casual copying; it is not DRM.
