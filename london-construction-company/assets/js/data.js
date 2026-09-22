/* Content model for London Construction Company.
   Editing text/adding projects here updates every page that renders from it. */
window.LCC = {
  business: {
    name: "London Construction Company",
    legal: "Toms-Arbel Ltd",
    tagline: "Bespoke design and build.",
    phoneDisplay: "+44 7902 010974",
    phoneRaw: "447902010974",
    instagram: "https://www.instagram.com/londonconstructioncompany",
    instagramHandle: "@londonconstructioncompany",
    address: {
      line: "3 Parkinson House, Frampton Park Road",
      city: "London",
      postcode: "E9 7PH",
      area: "Hackney, East London"
    },
    coords: { lat: 51.5425706, lng: -0.0509695 },
    mapsLink: "https://www.google.com/maps/place/London+Construction+Company+Toms-Arbel+Ltd/@51.5425706,-0.0509695,17z/",
    rating: "4.9",
    reviews: 65
  },

  /* Portfolio. `size` drives the asymmetric grid layout on wide screens. */
  projects: [
    { id:"graphite-galley", title:"Graphite Galley", cat:"Kitchens",
      img:"assets/img/graphite-kitchen.webp", size:"feature",
      desc:"A rear kitchen extension in brushed steel and honed stone, lit to fall away into shadow. Rooflight over the dining end, warm floor-wash lighting throughout." },
    { id:"calacatta-ascent", title:"Calacatta Ascent", cat:"Interiors",
      img:"assets/img/marble-stair.webp", size:"tall",
      desc:"A book-matched marble staircase with a concealed LED reveal, floating each tread against the wall for a weightless ascent." },
    { id:"powder-room", title:"The Powder Room", cat:"Bathrooms",
      img:"assets/img/powder-room.webp", size:"narrow",
      desc:"A jewel-box cloakroom wrapped in veined porcelain, a back-lit circular mirror and a solid brass basin tap." },
    { id:"concrete-loft", title:"Concrete Loft", cat:"Interiors",
      img:"assets/img/concrete-loft.webp", size:"wide",
      desc:"A warehouse conversion where raw concrete soffits and blackened steel meet a soft, liveable mezzanine bedroom." },
    { id:"terracotta-ensuite", title:"Terracotta Ensuite", cat:"Bathrooms",
      img:"assets/img/terracotta-bath.webp", size:"narrow",
      desc:"Hand-polished microcement in a warm blush, a curved oak vanity and a fully tanked walk-in shower." },
    { id:"sage-kitchen", title:"The Sage Kitchen", cat:"Kitchens",
      img:"assets/img/sage-kitchen.webp", size:"wide",
      desc:"A hand-painted shaker kitchen in a Victorian terrace — poured concrete worktops, open oak shelving and blackened crittall." },
    { id:"structural-rebuild", title:"Structural Rebuild", cat:"Structural",
      img:"assets/img/structural-build.webp", size:"tall",
      desc:"A full re-roof and new steel frame that opened the top floor for a light-filled loft conversion." },
    { id:"primary-hall", title:"Primary Hall", cat:"Interiors",
      img:"assets/img/sculptural-hall.webp", size:"narrow",
      desc:"A sculptural circulation space — slatted timber, a linear skylight and bold primary-coloured joinery doors." }
  ],

  services: [
    { t:"Design & Build", d:"One accountable team from the first sketch to the final handover — design, drawings, trades and project management under a single roof." },
    { t:"Full Refurbishment", d:"Whole-home renovations taken back to brick and rebuilt, with the mess, sequencing and sub-trades managed for you." },
    { t:"Kitchens", d:"Bespoke kitchens designed around how you actually cook and gather, built and installed by our own joiners and fitters." },
    { t:"Bathrooms & Wet Rooms", d:"Spa-calm bathrooms in marble, porcelain and microcement — fully tanked, beautifully lit and made to last." },
    { t:"Extensions & Structural", d:"Rear and side-return extensions, loft conversions and structural openings, engineered and built to Building Control sign-off." },
    { t:"Bespoke Joinery", d:"Made-to-measure staircases, wardrobes, panelling and cabinetry — the details that make a home feel considered." }
  ],

  process: [
    { t:"Consultation", tag:"Week 1", d:"We visit the property, listen to how you want to live in it and talk honestly about scope, timeline and budget before anything is committed." },
    { t:"Design & Drawings", tag:"Weeks 2–6", d:"Concepts, material selection and a detailed specification. Where the work needs planning permission or structural calculations, we handle it." },
    { t:"Build", tag:"On site", d:"One directly-employed team, a clear programme and a clean, protected site. You get a single point of contact and regular progress updates." },
    { t:"Handover", tag:"Completion", d:"A thorough snagging walkthrough, all certificates and manuals, and aftercare that continues long after the scaffolding comes down." }
  ],

  testimonials: [
    { q:"They took our tired Victorian terrace back to brick and rebuilt it into something calmer and better than we pictured. Precise, unflappable and genuinely lovely to have in the house.", who:"Homeowner, Hackney" },
    { q:"The finish is faultless. Every detail — the marble, the lighting, the way the doors close — was considered and then executed properly.", who:"Client, De Beauvoir" },
    { q:"On budget, on programme, and the site was swept and protected every single Friday. That tells you everything about how they work.", who:"Homeowner, London Fields" }
  ]
};
