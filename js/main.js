/* ==========================================================================
   VESSEL — Site behaviour
   Renders content from data.js and handles navigation, menus & animations.
   You normally won't need to edit this file — change text in data.js instead.
   ========================================================================== */

/* ---- Small helpers -------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const money = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);

const formatDate = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const addNights = (iso, nights) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + nights);
  return d.toISOString().slice(0, 10);
};

/* Content source: the Manage dashboard's saved edits if present,
   otherwise the published defaults from data.js. */
const DATA = typeof loadSiteData === "function" ? loadSiteData() : SITE;

const tripById = (id) => DATA.trips.find((t) => t.id === id);

const STATUS_LABELS = {
  available: "Available",
  limited: "Few spots left",
  soldout: "Sold out"
};

/* ==========================================================================
   Shared UI: header, mobile nav, scroll reveal, footer, brand
   ========================================================================== */
function initChrome() {
  // Fill brand + company text wherever the data-* hooks appear.
  $$("[data-company-name]").forEach((el) => (el.textContent = DATA.company.name));
  $$("[data-tagline]").forEach((el) => (el.textContent = DATA.company.tagline));
  $$("[data-boat-name]").forEach((el) => (el.textContent = DATA.company.boatName));
  $$("[data-phone]").forEach((el) => {
    el.textContent = DATA.company.phone;
    if (el.tagName === "A") el.href = "tel:" + DATA.company.phone.replace(/[^+\d]/g, "");
  });
  $$("[data-email]").forEach((el) => {
    el.textContent = DATA.company.email;
    if (el.tagName === "A") el.href = "mailto:" + DATA.company.email;
  });
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  $$("[data-location]").forEach((el) => (el.textContent = DATA.company.location));

  // Social links in the footer.
  const socialIcons = {
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube"
  };
  $$("[data-social]").forEach((wrap) => {
    wrap.innerHTML = Object.entries(DATA.company.social || {})
      .filter(([, url]) => url)
      .map(
        ([key, url]) =>
          `<a href="${url}" target="_blank" rel="noopener" aria-label="${socialIcons[key] || key}" title="${socialIcons[key] || key}">${(socialIcons[key] || key)[0]}</a>`
      )
      .join("");
  });

  // Sticky header state.
  const header = $(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle.
  const toggle = $(".nav__toggle");
  const links = $(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open");
      links.classList.toggle("open");
    });
    $$(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => {
        toggle.classList.remove("open");
        links.classList.remove("open");
      })
    );
  }

  // Highlight the current page in the nav.
  const page = document.body.dataset.page;
  $$(".nav__links a").forEach((a) => {
    if (a.dataset.nav === page) a.classList.add("active");
  });

  // Reveal-on-scroll.
  const revealables = $$(".reveal");
  if ("IntersectionObserver" in window && revealables.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("visible"));
  }
}

/* ==========================================================================
   Home page renderers
   ========================================================================== */
function renderHome() {
  const intro = $("[data-intro]");
  if (intro) intro.textContent = DATA.company.intro;

  const featuredWrap = $("[data-featured-trips]");
  if (featuredWrap) {
    const featured = DATA.trips.filter((t) => t.featured).slice(0, 3);
    featuredWrap.innerHTML = featured.map(tripCardHTML).join("");
  }
}

/* ==========================================================================
   Trips page
   ========================================================================== */
function renderTrips() {
  const wrap = $("[data-all-trips]");
  if (!wrap) return;
  wrap.innerHTML = DATA.trips.map((t) => tripCardHTML(t, true)).join("");
}

function tripCardHTML(trip, withItinerary = false) {
  const highlights = trip.highlights
    .map((h) => `<li>${h}</li>`)
    .join("");

  const itinerary =
    withItinerary && trip.itinerary
      ? `<details class="trip-card__itinerary">
           <summary>View day-by-day itinerary</summary>
           <ol>${trip.itinerary.map((d) => `<li>${d}</li>`).join("")}</ol>
         </details>`
      : "";

  return `
    <article class="trip-card reveal">
      <div class="trip-card__media">
        <img src="${trip.image}" alt="${trip.name}" loading="lazy" />
        <span class="trip-card__tag">${trip.nights} nights</span>
      </div>
      <div class="trip-card__body">
        <span class="trip-card__loc">${trip.destination}</span>
        <h3>${trip.name}</h3>
        <p class="trip-card__summary">${trip.summary}</p>
        <ul class="trip-card__highlights">${highlights}</ul>
        <div class="trip-card__foot">
          <div class="trip-card__price">
            <small>from</small>
            <strong>${money(trip.priceFrom, trip.currency)}</strong>
          </div>
          <a class="btn btn--dark" href="schedule.html">See dates</a>
        </div>
        ${itinerary}
      </div>
    </article>`;
}

/* ==========================================================================
   Schedule page
   ========================================================================== */
function renderSchedule() {
  const body = $("[data-schedule-body]");
  if (!body) return;

  const rows = [...DATA.departures]
    .sort((a, b) => a.depart.localeCompare(b.depart))
    .map((dep) => {
      const trip = tripById(dep.tripId);
      if (!trip) return "";
      const ret = addNights(dep.depart, trip.nights);
      const status = dep.status || "available";
      return `
        <tr>
          <td data-label="Expedition">
            <span class="schedule__trip">${trip.name}</span>
            <span class="schedule__dest">${trip.destination}</span>
          </td>
          <td data-label="Departs" class="schedule__date">
            <strong>${formatDate(dep.depart)}</strong>
            <small>${trip.nights} nights</small>
          </td>
          <td data-label="Returns" class="schedule__date">
            <strong>${formatDate(ret)}</strong>
          </td>
          <td data-label="Availability">
            <span class="badge badge--${status}">${STATUS_LABELS[status]}</span>
          </td>
          <td data-label="From" class="schedule__price">
            ${money(trip.priceFrom, trip.currency)}
          </td>
        </tr>`;
    })
    .join("");

  body.innerHTML = rows;
}

/* ==========================================================================
   Boat page
   ========================================================================== */
function renderBoat() {
  const cabinsWrap = $("[data-cabins]");
  if (cabinsWrap) {
    cabinsWrap.innerHTML = DATA.cabins
      .map(
        (c) => `
      <article class="cabin-card reveal">
        <img src="${c.image}" alt="${c.name}" loading="lazy" />
        <div class="cabin-card__body">
          <h3>${c.name}</h3>
          <p class="cabin-card__occ">${c.occupancy}</p>
          <ul class="cabin-card__features">
            ${c.features.map((f) => `<li>${f}</li>`).join("")}
          </ul>
          <div class="cabin-card__price">
            <small>from</small>
            <strong>${money(c.priceFrom)}</strong>
            <small>per person</small>
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  const amenitiesWrap = $("[data-amenities]");
  if (amenitiesWrap) {
    amenitiesWrap.innerHTML = DATA.amenities
      .map(
        (a) => `
      <div class="amenity reveal">
        <div class="ic">${a.icon}</div>
        <h3>${a.title}</h3>
        <p>${a.text}</p>
      </div>`
      )
      .join("");
  }

  const crewWrap = $("[data-crew]");
  if (crewWrap) {
    crewWrap.innerHTML = DATA.crew
      .map(
        (m) => `
      <div class="crew-card reveal">
        <img src="${m.image}" alt="${m.name}" loading="lazy" />
        <h3>${m.name}</h3>
        <div class="role">${m.role}</div>
        <p>${m.bio}</p>
      </div>`
      )
      .join("");
  }

  const galleryWrap = $("[data-gallery]");
  if (galleryWrap) {
    galleryWrap.innerHTML = DATA.gallery
      .map((src) => `<img src="${src}" alt="Life aboard ${DATA.company.boatName}" loading="lazy" />`)
      .join("");
  }
}

/* ==========================================================================
   Boot
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initChrome();
  renderHome();
  renderTrips();
  renderSchedule();
  renderBoat();

  // Re-observe any cards that were injected after initial reveal setup.
  const late = $$(".reveal:not(.visible)");
  if ("IntersectionObserver" in window && late.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    late.forEach((el) => io.observe(el));
  }
});
