/*
 * ============================================================================
 *  VESSEL — SITE CONTENT
 * ============================================================================
 *  This is the ONLY file you need to edit to change what appears on the site.
 *  No coding knowledge required — just change the text inside the quotes.
 *
 *  Tips:
 *   - Keep the quotes "like this" around text.
 *   - Separate each item with a comma.
 *   - To swap a photo, replace the image link (or drop your own photo into the
 *     /images folder and use "images/your-photo.jpg").
 * ============================================================================
 */

const SITE = {
  /* ---- Company / brand details ---------------------------------------- */
  company: {
    name: "Ascend Vacation",
    tagline: "50m luxury dive liveaboard",
    boatName: "MV Ocean Explorer",
    phone: "+1 (555) 012-3456",
    email: "hello@oceanexplorer-liveaboard.com",
    location: "Departing from Bali, Indonesia",
    // A short intro shown on the home page.
    intro:
      "Wake up somewhere new every morning. Ascend Vacation runs small-group diving expeditions aboard MV Ocean Explorer — a 50-metre luxury liveaboard — to the most remote and beautiful reefs on the planet, with a crew that treats you like family.",
    // Social links (leave "" to hide).
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      youtube: ""
    }
  },

  /* ---- Trips / itineraries -------------------------------------------- */
  /* Each trip is one card on the Trips page and can be featured on the Home page. */
  trips: [
    {
      id: "raja-ampat",
      name: "Raja Ampat Expedition",
      destination: "Raja Ampat, Indonesia",
      nights: 10,
      priceFrom: 4200,
      currency: "USD",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      summary:
        "The crown jewel of marine biodiversity. Drift past soft coral gardens, manta cleaning stations, and schooling fish so thick they block the sun.",
      highlights: [
        "24+ dives across the Dampier Strait & Misool",
        "Manta rays, wobbegongs & pygmy seahorses",
        "Remote islands with no other boats in sight"
      ],
      itinerary: [
        "Day 1 — Board in Sorong, welcome dinner & check dive",
        "Days 2–4 — Dampier Strait: Cape Kri, Blue Magic, Sardine Reef",
        "Days 5–8 — Misool: soft coral walls & hidden lagoons",
        "Days 9–10 — Northern reefs & return to Sorong"
      ]
    },
    {
      id: "komodo",
      name: "Komodo National Park",
      destination: "Komodo, Indonesia",
      nights: 7,
      priceFrom: 2950,
      currency: "USD",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=1200&q=80",
      summary:
        "High-voltage drift dives, mantas on the menu, and a shore visit to meet the famous Komodo dragons.",
      highlights: [
        "Manta Alley & Batu Bolong drift dives",
        "Land excursion to see Komodo dragons",
        "Pink Beach snorkeling & sunset paddleboarding"
      ],
      itinerary: [
        "Day 1 — Board in Labuan Bajo, orientation & night dive",
        "Days 2–3 — Central Komodo: Batu Bolong, Tatawa",
        "Days 4–5 — South Komodo: Manta Alley & Cannibal Rock",
        "Days 6–7 — Dragon trek, Pink Beach & return"
      ]
    },
    {
      id: "similan",
      name: "Similan Islands Cruise",
      destination: "Similan Islands, Thailand",
      nights: 5,
      priceFrom: 1850,
      currency: "USD",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
      summary:
        "Granite boulder swim-throughs, powder-white beaches and a shot at whale sharks and mantas at Richelieu Rock.",
      highlights: [
        "Richelieu Rock — Thailand's #1 dive site",
        "Whale shark & manta ray encounters (seasonal)",
        "Dramatic granite arches & swim-throughs"
      ],
      itinerary: [
        "Day 1 — Board in Khao Lak, evening departure",
        "Days 2–3 — Similan boulders & Elephant Head Rock",
        "Day 4 — Koh Bon & Koh Tachai pinnacles",
        "Day 5 — Richelieu Rock & return to port"
      ]
    },
    {
      id: "maldives",
      name: "Maldives Central Atolls",
      destination: "Maldives",
      nights: 7,
      priceFrom: 3400,
      currency: "USD",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80",
      summary:
        "Channel dives packed with grey reef sharks, eagle rays and the unforgettable night snorkel with feeding mantas.",
      highlights: [
        "Manta night snorkel at Hanifaru (seasonal)",
        "Shark-filled channel drifts",
        "Sandbank picnic & sunset cruise"
      ],
      itinerary: [
        "Day 1 — Board in Malé, sunset cruise to first atoll",
        "Days 2–5 — North & South Ari Atoll channels",
        "Day 6 — Sandbank BBQ & manta snorkel",
        "Day 7 — Final dives & return to Malé"
      ]
    }
  ],

  /* ---- Departure schedule --------------------------------------------- */
  /* "tripId" must match an "id" from the trips above.                      */
  /* "status" can be: "available", "limited", or "soldout".                 */
  departures: [
    { tripId: "similan", depart: "2026-08-14", status: "available" },
    { tripId: "komodo", depart: "2026-08-22", status: "limited" },
    { tripId: "raja-ampat", depart: "2026-09-05", status: "available" },
    { tripId: "maldives", depart: "2026-09-19", status: "soldout" },
    { tripId: "komodo", depart: "2026-10-03", status: "available" },
    { tripId: "similan", depart: "2026-10-18", status: "limited" },
    { tripId: "raja-ampat", depart: "2026-11-07", status: "available" },
    { tripId: "maldives", depart: "2026-11-21", status: "available" }
  ],

  /* ---- The boat: cabins ----------------------------------------------- */
  cabins: [
    {
      name: "Lower Deck Twin",
      occupancy: "2 guests",
      priceFrom: 1850,
      image:
        "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?auto=format&fit=crop&w=1000&q=80",
      features: ["Twin beds", "En-suite bathroom", "Air conditioning", "Ocean-level portholes"]
    },
    {
      name: "Main Deck Double",
      occupancy: "2 guests",
      priceFrom: 2400,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
      features: ["Queen bed", "En-suite bathroom", "Large window", "Extra storage"]
    },
    {
      name: "Master Suite",
      occupancy: "2 guests",
      priceFrom: 3200,
      image:
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1000&q=80",
      features: ["King bed", "Private balcony", "Spa bathroom", "Panoramic windows"]
    }
  ],

  /* ---- The boat: amenities -------------------------------------------- */
  amenities: [
    { icon: "🤿", title: "Full dive deck", text: "Spacious kitting-up stations, rinse tanks, camera table and nitrox on demand." },
    { icon: "🛥️", title: "Two tenders", text: "Fast dinghies get you to the site quickly and pick you up right where you surface." },
    { icon: "🍽️", title: "Chef-cooked meals", text: "Fresh, locally sourced dishes with vegetarian and dietary options at every seating." },
    { icon: "☀️", title: "Sun deck & lounge", text: "Loungers, shaded seating, a jacuzzi and the best sunset seats on the water." },
    { icon: "📸", title: "Camera room", text: "Dedicated charging, drying and workstation space for underwater photographers." },
    { icon: "🩺", title: "Safety first", text: "Oxygen, first aid, DAN-trained crew and satellite comms on every voyage." }
  ],

  /* ---- The boat: crew ------------------------------------------------- */
  crew: [
    {
      name: "Captain Adi",
      role: "Captain",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      bio: "20 years navigating Indonesian waters and still finds a new favourite reef every season."
    },
    {
      name: "Maya",
      role: "Cruise Director",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      bio: "Makes sure every guest feels at home — and never misses a manta."
    },
    {
      name: "Tom",
      role: "Lead Dive Guide",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      bio: "PADI Course Director with an uncanny eye for pygmy seahorses and macro critters."
    }
  ],

  /* ---- Gallery photos (About the boat page) --------------------------- */
  /* Your own boat photos live in the /images folder. Reef shots are online
     placeholders — swap them for your own underwater photos when ready.      */
  gallery: [
    "images/boat-sea.jpg",
    "images/boat-side.jpg",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=800&q=80"
  ]
};
