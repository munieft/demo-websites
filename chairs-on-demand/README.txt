CHAIRS ON DEMAND — WEBSITE
==========================
A premium 5-page static website for Chairs on Demand LTD
(chair, table, linen & charger plate hire — weddings, events & exhibitions).


1. HOW TO VIEW / HOST IT
------------------------
This is a static site (HTML, CSS, JS, images, video) — no server, database
or build step required.

  • Quick local preview: open index.html in a browser. (A couple of features —
    the Google Fonts, the map embed and WhatsApp links — need an internet
    connection.)

  • To send it to someone: upload the WHOLE "chairs-on-demand" folder to any
    static host and share the link. Free options that take a drag-and-drop of
    the folder: Netlify Drop (app.netlify.com/drop), Cloudflare Pages, Vercel,
    GitHub Pages, or any normal web hosting via FTP. Keep the folder structure
    intact — index.html must sit alongside the /assets folder.

  • Make sure the host serves index.html as the default page (all of them do).


2. PAGES
--------
  index.html ........ Home (hero video, collection preview, process, reviews)
  collection.html ... The full hire range
  gallery.html ...... Lookbook with click-to-enlarge lightbox
  about.html ........ Story, why-choose-us, service areas
  contact.html ...... Enquiry form + details + map


3. EDITING CONTENT
------------------
Most text and all the collection / gallery / review content is driven from ONE
place so it's easy to update:

  assets/js/content.min.js

Open it in any text editor. You'll see the business details (phone, WhatsApp,
Instagram, address, hours), the collection ranges, the gallery list and the
reviews. Change the text between the quotes and re-upload the file. The page
headings and intro paragraphs live directly in the .html files.

  >> IMPORTANT — TESTIMONIALS: The three reviews on the site are SAMPLE
     placeholders written to show the layout (names Aisha K. / Daniel R. /
     Priya M.). Your business has a genuine 5.0 rating from 95+ Google reviews
     — please replace the sample quotes with real review text (and real first
     names) before going live. They're in content.min.js under "reviews".

  >> The enquiry form's "Send enquiry" button opens WhatsApp with the visitor's
     details pre-filled to your number (+44 7932 071474). No email address was
     provided, so contact runs through WhatsApp / phone / Instagram / the form.
     If you'd like the form to send email instead, a free service like Formspree
     can be wired in — happy to set that up.


4. IMAGES & VIDEO
-----------------
All photos you supplied were optimised for the web (resized, compressed, and
saved in both modern WebP and JPEG formats for speed). The hero video was
re-encoded for fast streaming. Originals are untouched on your side.

To swap an image, replace the matching file in assets/img/ (keep the same
filename and provide both a .jpg and .webp, or ask and I'll regenerate them).


5. ABOUT THE "DON'T LET THEM DOWNLOAD IT" REQUEST  (please read)
---------------------------------------------------------------
You asked that a reviewer viewing the temporary link shouldn't be able to just
download the HTML and get the whole site for free. Here's the honest position:

  • The site has been deliberately structured to make that HARD, not trivial.
    It is split across many files; the page content, navigation and footer are
    assembled at runtime by minified/obfuscated JavaScript, so a single saved
    .html file is only an empty shell — not the finished site. The CSS and JS
    are minified (compressed and unreadable), and there is no one file that
    contains "everything".

  • BUT — and this is true of EVERY static website on the internet — anything a
    browser can display, a determined person can technically access, because
    the browser must download the files to render them. No purely front-end
    site (from anyone) can make this 100% impossible.

  • For genuine protection when you go live, the site should sit behind proper
    hosting with password protection / a login, or be built on a platform/CMS
    where the content lives on a server the visitor never receives. For simply
    sending a sample to one person to review, the current structure is a strong,
    practical deterrent.


6. TECH NOTES
-------------
  • Fully responsive (mobile → desktop), keyboard-accessible, reduced-motion
    respected, with SEO meta tags and business schema on the home page.
  • Fonts: Cormorant Garamond + Jost (loaded from Google Fonts).
  • No tracking or third-party code beyond Google Fonts and the Google Maps
    embed on the contact page.

Questions or changes — just ask.
