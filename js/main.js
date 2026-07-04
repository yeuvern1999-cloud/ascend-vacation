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
          <a class="btn btn--dark" href="book.html?trip=${trip.id}">Book this trip</a>
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
   Booking page
   ========================================================================== */
function renderBooking() {
  const form = $("#booking-form");
  if (!form) return;

  const booking = DATA.booking || {};
  const introEl = $("[data-booking-intro]");
  if (introEl && booking.intro) introEl.textContent = booking.intro;

  const tripSel = $("#bk-trip");
  const depSel = $("#bk-departure");
  const guestsEl = $("#bk-guests");
  const roomsWrap = $("#bk-rooms");
  const berthEl = $("#bk-berths");
  const note = $("#bk-note");

  // The vessel's cabin inventory (falls back to a default if not set in data.js).
  const rooms =
    booking.rooms && booking.rooms.length
      ? booking.rooms
      : [
          { id: "double", name: "Double cabin", sleeps: 2, count: 12 },
          { id: "triple", name: "Triple cabin", sleeps: 3, count: 1 },
          { id: "single", name: "Single cabin", sleeps: 1, count: 1 }
        ];

  // Which trip should be preselected? (from ?trip=id)
  const preselectId = new URLSearchParams(location.search).get("trip");

  // Expedition options.
  tripSel.innerHTML =
    `<option value="">Choose an expedition…</option>` +
    DATA.trips
      .map(
        (t) =>
          `<option value="${t.id}">${t.name} — ${t.destination} (${t.nights} nights)</option>`
      )
      .join("");
  if (preselectId && DATA.trips.some((t) => t.id === preselectId)) {
    tripSel.value = preselectId;
  }

  // Cabin picker — one quantity stepper per cabin type.
  roomsWrap.innerHTML = rooms
    .map(
      (r) => `
      <div class="room-row" data-room-row="${r.id}">
        <div class="room-row__info">
          <span class="room-row__name">${r.name}</span>
          <span class="room-row__meta">Sleeps ${r.sleeps} · ${r.count} on board${r.note ? " · " + r.note : ""}</span>
        </div>
        <div class="stepper" data-room="${r.id}" data-sleeps="${r.sleeps}" data-max="${r.count}">
          <button type="button" class="stepper__btn" data-step="-1" aria-label="Fewer ${r.name}">−</button>
          <input class="stepper__val" type="number" name="room_${r.id}" value="0" min="0" max="${r.count}" readonly aria-label="${r.name} quantity" />
          <button type="button" class="stepper__btn" data-step="1" aria-label="More ${r.name}">＋</button>
        </div>
      </div>`
    )
    .join("");

  const updateBerths = () => {
    let berths = 0;
    let cabins = 0;
    roomsWrap.querySelectorAll(".stepper").forEach((s) => {
      const qty = +s.querySelector(".stepper__val").value || 0;
      berths += qty * +s.dataset.sleeps;
      cabins += qty;
      const row = s.closest(".room-row");
      if (row) row.classList.toggle("is-picked", qty > 0);
      s.querySelector('[data-step="-1"]').disabled = qty <= 0;
      s.querySelector('[data-step="1"]').disabled = qty >= +s.dataset.max;
    });
    const pax = +guestsEl.value || 0;
    berthEl.classList.remove("is-short", "is-ok");
    if (cabins === 0) {
      berthEl.innerHTML = `No cabins chosen yet — leave as-is and we'll recommend the best fit for <strong>${pax}</strong> guest${pax === 1 ? "" : "s"}.`;
    } else if (berths < pax) {
      berthEl.classList.add("is-short");
      berthEl.innerHTML = `<strong>${cabins}</strong> cabin${cabins === 1 ? "" : "s"} · <strong>${berths}</strong> berths — not enough for <strong>${pax}</strong> guests. Add another cabin.`;
    } else {
      berthEl.classList.add("is-ok");
      berthEl.innerHTML = `<strong>${cabins}</strong> cabin${cabins === 1 ? "" : "s"} · <strong>${berths}</strong> berths for <strong>${pax}</strong> guests ✓`;
    }
  };

  roomsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".stepper__btn");
    if (!btn) return;
    const stepper = btn.closest(".stepper");
    const input = stepper.querySelector(".stepper__val");
    const max = +stepper.dataset.max;
    let v = (+input.value || 0) + +btn.dataset.step;
    v = Math.max(0, Math.min(max, v));
    input.value = v;
    updateBerths();
  });
  guestsEl.addEventListener("input", updateBerths);
  updateBerths();

  // Departure options depend on the chosen trip.
  const fillDepartures = () => {
    const tid = tripSel.value;
    const deps = [...DATA.departures]
      .filter((d) => d.tripId === tid)
      .sort((a, b) => a.depart.localeCompare(b.depart));
    const opts = deps
      .map((d) => {
        const status = d.status || "available";
        const label =
          formatDate(d.depart) +
          (status !== "available" ? ` — ${STATUS_LABELS[status]}` : "");
        const disabled = status === "soldout" ? " disabled" : "";
        return `<option value="${formatDate(d.depart)}"${disabled}>${label}</option>`;
      })
      .join("");
    depSel.innerHTML =
      `<option value="I'm flexible / not sure yet">I'm flexible / not sure yet</option>` +
      opts;
  };
  fillDepartures();
  tripSel.addEventListener("change", fillDepartures);

  // Submit → Web3Forms (emails the request to you). Public access key is safe.
  const submitBtn = $(".bform__submit", form);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    note.textContent = "";
    note.className = "bform__note";

    // Basic validation.
    let firstBad = null;
    ["#bk-name", "#bk-email", "#bk-trip"].forEach((sel) => {
      const el = $(sel, form);
      const ok = el.value.trim() && el.checkValidity();
      el.classList.toggle("invalid", !ok);
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) {
      note.textContent = "Please fill in your name, a valid email and an expedition.";
      note.classList.add("error");
      firstBad.focus();
      return;
    }

    const key = ((DATA.booking && DATA.booking.accessKey) || "").trim();
    if (!key) {
      note.textContent =
        "Booking isn't connected yet. (Site owner: add your Web3Forms access key in the Manage dashboard.)";
      note.classList.add("info");
      return;
    }

    const fd = new FormData(form);
    const trip = DATA.trips.find((t) => t.id === fd.get("trip"));
    const chosenRooms = rooms
      .map((r) => {
        const qty = +fd.get("room_" + r.id) || 0;
        return qty > 0 ? `${qty} × ${r.name}` : null;
      })
      .filter(Boolean)
      .join(", ");
    const payload = {
      access_key: key,
      subject: `New booking request — ${fd.get("name")}`,
      from_name: `${DATA.company.name} booking form`,
      // lowercase name/email let Web3Forms set the sender + Reply-To automatically
      name: fd.get("name"),
      email: fd.get("email"),
      Phone: fd.get("phone") || "—",
      Guests: fd.get("guests") || "—",
      Expedition: trip ? `${trip.name} (${trip.destination})` : "—",
      "Preferred departure": fd.get("departure") || "—",
      Cabins: chosenRooms || "No preference — please advise",
      Message: fd.get("message") || "—",
      botcheck: fd.get("botcheck") ? true : false
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        const successMsg =
          (DATA.booking && DATA.booking.successMessage) ||
          "Thank you! Your booking request has been sent.";
        $("#bk-success-msg").textContent = successMsg;
        form.hidden = true;
        $("#bk-success").hidden = false;
        window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      note.textContent =
        "Sorry, something went wrong sending your request. Please try again or email us directly.";
      note.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send booking request";
    }
  });
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
  renderBooking();

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
