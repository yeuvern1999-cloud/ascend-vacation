/* ============================================================================
 *  LMS Adventures — website content
 *  Saved from the Manage dashboard on 7/5/2026, 3:40:17 PM.
 *  This file holds everything shown on the site. You can hand-edit it too.
 * ============================================================================ */

const SITE = {
  "company": {
    "name": "LMS Adventures",
    "tagline": "49m luxury dive liveaboard",
    "boatName": "Queenesia III",
    "phone": "+60 121234567",
    "email": "hello@oceanexplorer-liveaboard.com",
    "location": "Departing from Labuan Bajo, Indonesia",
    "intro": "Wake up somewhere new every morning. LMS Adventures runs small-group diving expeditions aboard Queenesia III — a 49-metre 3 star liveaboard — to the most remote and beautiful reefs on the planet, with a crew that treats you like family.",
    "social": {
      "instagram": "https://instagram.com",
      "facebook": "https://facebook.com",
      "youtube": ""
    }
  },
  "trips": [
    {
      "id": "raja-ampat",
      "name": "Raja Ampat Expedition",
      "destination": "Raja Ampat, Indonesia",
      "nights": 10,
      "priceFrom": 4200,
      "currency": "USD",
      "featured": true,
      "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "summary": "The crown jewel of marine biodiversity. Drift past soft coral gardens, manta cleaning stations, and schooling fish so thick they block the sun.",
      "highlights": [
        "24+ dives across the Dampier Strait & Misool",
        "Manta rays, wobbegongs & pygmy seahorses",
        "Remote islands with no other boats in sight"
      ],
      "itinerary": [
        "Day 1 — Board in Sorong, welcome dinner & check dive",
        "Days 2–4 — Dampier Strait: Cape Kri, Blue Magic, Sardine Reef",
        "Days 5–8 — Misool: soft coral walls & hidden lagoons",
        "Days 9–10 — Northern reefs & return to Sorong"
      ]
    },
    {
      "id": "komodo",
      "name": "Komodo National Park",
      "destination": "Komodo, Indonesia",
      "nights": 7,
      "priceFrom": 2950,
      "currency": "USD",
      "featured": true,
      "image": "https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=1200&q=80",
      "summary": "High-voltage drift dives, mantas on the menu, and a shore visit to meet the famous Komodo dragons.",
      "highlights": [
        "Manta Alley & Batu Bolong drift dives",
        "Land excursion to see Komodo dragons",
        "Pink Beach snorkeling & sunset paddleboarding"
      ],
      "itinerary": [
        "Day 1 — Board in Labuan Bajo, orientation & night dive",
        "Days 2–3 — Central Komodo: Batu Bolong, Tatawa",
        "Days 4–5 — South Komodo: Manta Alley & Cannibal Rock",
        "Days 6–7 — Dragon trek, Pink Beach & return"
      ]
    },
    {
      "id": "similan",
      "name": "Similan Islands Cruise",
      "destination": "Similan Islands, Thailand",
      "nights": 5,
      "priceFrom": 1850,
      "currency": "USD",
      "featured": true,
      "image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
      "summary": "Granite boulder swim-throughs, powder-white beaches and a shot at whale sharks and mantas at Richelieu Rock.",
      "highlights": [
        "Richelieu Rock — Thailand's #1 dive site",
        "Whale shark & manta ray encounters (seasonal)",
        "Dramatic granite arches & swim-throughs"
      ],
      "itinerary": [
        "Day 1 — Board in Khao Lak, evening departure",
        "Days 2–3 — Similan boulders & Elephant Head Rock",
        "Day 4 — Koh Bon & Koh Tachai pinnacles",
        "Day 5 — Richelieu Rock & return to port"
      ]
    },
    {
      "id": "maldives",
      "name": "Maldives Central Atolls",
      "destination": "Maldives",
      "nights": 7,
      "priceFrom": 3400,
      "currency": "USD",
      "featured": false,
      "image": "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80",
      "summary": "Channel dives packed with grey reef sharks, eagle rays and the unforgettable night snorkel with feeding mantas.",
      "highlights": [
        "Manta night snorkel at Hanifaru (seasonal)",
        "Shark-filled channel drifts",
        "Sandbank picnic & sunset cruise"
      ],
      "itinerary": [
        "Day 1 — Board in Malé, sunset cruise to first atoll",
        "Days 2–5 — North & South Ari Atoll channels",
        "Day 6 — Sandbank BBQ & manta snorkel",
        "Day 7 — Final dives & return to Malé"
      ]
    }
  ],
  "departures": [
    {
      "tripId": "similan",
      "depart": "2026-08-14",
      "status": "available"
    },
    {
      "tripId": "komodo",
      "depart": "2026-08-22",
      "status": "limited"
    },
    {
      "tripId": "raja-ampat",
      "depart": "2026-09-05",
      "status": "available"
    },
    {
      "tripId": "maldives",
      "depart": "2026-09-19",
      "status": "soldout"
    },
    {
      "tripId": "komodo",
      "depart": "2026-10-03",
      "status": "available"
    },
    {
      "tripId": "similan",
      "depart": "2026-10-18",
      "status": "limited"
    },
    {
      "tripId": "raja-ampat",
      "depart": "2026-11-07",
      "status": "available"
    },
    {
      "tripId": "maldives",
      "depart": "2026-11-21",
      "status": "available"
    }
  ],
  "cabins": [
    {
      "name": "Lower Deck Twin",
      "occupancy": "2 guests",
      "priceFrom": 4250,
      "image": "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?auto=format&fit=crop&w=1000&q=80",
      "features": [
        "Twin beds",
        "En-suite bathroom",
        "Air conditioning",
        "Ocean-level portholes"
      ]
    },
    {
      "name": "Main Deck Double",
      "occupancy": "2 guests",
      "priceFrom": 4250,
      "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
      "features": [
        "Two single-bed",
        "En-suite bathroom"
      ]
    },
    {
      "name": "Single room",
      "occupancy": "1 guest",
      "priceFrom": 4300,
      "image": "images/single-room.png",
      "features": [
        "Enjoy your own private space with a cozy single cabin, thoughtfully designed for solo travelers seeking comfort, privacy, and convenience throughout their liveaboard journey."
      ]
    },
    {
      "name": "Lower Deck Triple",
      "occupancy": "3 guests",
      "priceFrom": 4200,
      "image": "images/triple-room.png",
      "features": [
        "A comfortable cabin accommodating up to three guests, equipped with cozy beds and all the essentials for a relaxing stay on board."
      ]
    }
  ],
  "amenities": [
    {
      "icon": "🤿",
      "title": "Full dive deck",
      "text": "Spacious kitting-up stations, rinse tanks, camera table and nitrox on demand."
    },
    {
      "icon": "🛥️",
      "title": "Two tenders",
      "text": "Fast dinghies get you to the site quickly and pick you up right where you surface."
    },
    {
      "icon": "🍽️",
      "title": "Chef-cooked meals",
      "text": "Fresh, locally sourced dishes with vegetarian and dietary options at every seating."
    },
    {
      "icon": "☀️",
      "title": "Sun deck & lounge",
      "text": "Loungers, shaded seating, a jacuzzi and the best sunset seats on the water."
    },
    {
      "icon": "📸",
      "title": "Camera room",
      "text": "Dedicated charging, drying and workstation space for underwater photographers."
    },
    {
      "icon": "🩺",
      "title": "Safety first",
      "text": "Oxygen, first aid, DAN-trained crew and satellite comms on every voyage."
    }
  ],
  "crew": [
    {
      "name": "Captain Adi",
      "role": "Captain",
      "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      "bio": "20 years navigating Indonesian waters and still finds a new favourite reef every season."
    },
    {
      "name": "Maya",
      "role": "Cruise Director",
      "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      "bio": "Makes sure every guest feels at home — and never misses a manta."
    },
    {
      "name": "Tom",
      "role": "Lead Dive Guide",
      "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      "bio": "PADI Course Director with an uncanny eye for pygmy seahorses and macro critters."
    }
  ],
  "gallery": [
    "images/boat-sea.jpg",
    "images/boat-side.jpg",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=800&q=80"
  ],
  "booking": {
    "accessKey": "",
    "intro": "Tell us which expedition you have in mind and we'll check availability and email you back within 24 hours. No payment now — this is a request, not a charge.",
    "successMessage": "Thank you! Your booking request is in. We'll email you within 24 hours to confirm availability and the next steps.",
    "rooms": [
      {
        "id": "double",
        "name": "Double cabin",
        "sleeps": 2,
        "count": 12,
        "note": "Queen or twin beds, en-suite"
      },
      {
        "id": "triple",
        "name": "Triple cabin",
        "sleeps": 3,
        "count": 1,
        "note": "Great for families or friends"
      },
      {
        "id": "single",
        "name": "Single cabin",
        "sleeps": 1,
        "count": 1,
        "note": "Solo occupancy, no sharing"
      }
    ]
  }
};
