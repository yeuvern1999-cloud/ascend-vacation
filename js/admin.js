/* ==========================================================================
   OCEAN EXPLORER — Manage dashboard
   --------------------------------------------------------------------------
   Edits a working copy of the site content. Changes autosave to the browser
   (localStorage) so the public pages preview them immediately. "Publish"
   exports an updated data.js to upload to your host for everyone to see.
   ========================================================================== */

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='92'%20height='64'%3E%3Crect%20width='92'%20height='64'%20fill='%23e8e2d4'/%3E%3Ctext%20x='46'%20y='38'%20font-size='11'%20fill='%23a99f88'%20text-anchor='middle'%20font-family='sans-serif'%3Eimage%3C/text%3E%3C/svg%3E";

/* Working copy of the content (saved edits, or published defaults). */
let state = loadSiteData();

/* ---- Utilities ------------------------------------------------------ */
function esc(s) {
  return String(s == null ? "" : s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

const setStatus = (text, cls = "") => {
  const el = document.getElementById("status");
  el.textContent = text;
  el.className = "admin-status " + cls;
};

let saveTimer;
function scheduleSave() {
  setStatus("Saving…", "is-dirty");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const ok = saveSiteData(state);
    setStatus(
      ok ? "All changes saved in this browser" : "Preview blocked — use Publish to save a file",
      ok ? "" : "is-error"
    );
  }, 350);
}

/* ---- Field builders (values are filled by hydrate, not inline) ------ */
const idxAttr = (i) => (i == null ? "" : ` data-index="${i}"`);

function textField(scope, field, label, o = {}) {
  return `<div class="field"><label>${label}${o.hint ? ` <span class="hint">${o.hint}</span>` : ""}</label>
    <input type="text" data-scope="${scope}" data-field="${field}" data-type="text"${idxAttr(o.index)} placeholder="${esc(o.ph || "")}"></div>`;
}
function numberField(scope, field, label, o = {}) {
  return `<div class="field"><label>${label}${o.hint ? ` <span class="hint">${o.hint}</span>` : ""}</label>
    <input type="number" min="0" data-scope="${scope}" data-field="${field}" data-type="number"${idxAttr(o.index)}></div>`;
}
function dateField(scope, field, label, o = {}) {
  return `<div class="field"><label>${label}${o.hint ? ` <span class="hint">${o.hint}</span>` : ""}</label>
    <input type="date" data-scope="${scope}" data-field="${field}" data-type="date"${idxAttr(o.index)}></div>`;
}
function textareaField(scope, field, label, o = {}) {
  return `<div class="field"><label>${label}${o.hint ? ` <span class="hint">${o.hint}</span>` : ""}</label>
    <textarea rows="${o.rows || 3}" data-scope="${scope}" data-field="${field}" data-type="text"${idxAttr(o.index)}></textarea></div>`;
}
function linesField(scope, field, label, o = {}) {
  return `<div class="field"><label>${label}${o.hint ? ` <span class="hint">${o.hint}</span>` : ""}</label>
    <textarea rows="${o.rows || 4}" data-scope="${scope}" data-field="${field}" data-type="lines"${idxAttr(o.index)}></textarea></div>`;
}
function checkField(scope, field, label, o = {}) {
  return `<div class="field field--check"><input type="checkbox" data-scope="${scope}" data-field="${field}" data-type="bool"${idxAttr(o.index)}><label>${label}</label></div>`;
}
function selectField(scope, field, label, options, o = {}) {
  const opts = options.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join("");
  return `<div class="field"><label>${label}${o.hint ? ` <span class="hint">${o.hint}</span>` : ""}</label>
    <select data-scope="${scope}" data-field="${field}" data-type="text"${idxAttr(o.index)}>${opts}</select></div>`;
}
function imageField(scope, field, label, o = {}) {
  return `<div class="field"><label>${label}${o.hint ? ` <span class="hint">${o.hint}</span>` : ""}</label>
    <div class="imgfield">
      <input type="text" data-scope="${scope}" data-field="${field}" data-type="text"${idxAttr(o.index)} placeholder="images/your-photo.jpg  or  https://…">
      <img class="thumb" alt="preview" src="${PLACEHOLDER}">
    </div></div>`;
}

function panelHead(title, intro, addKey, addLabel) {
  return `<div class="panel__head"><h1>${title}</h1>${
    addKey ? `<button class="abtn abtn--gold" data-add="${addKey}">＋ ${addLabel}</button>` : ""
  }</div><p class="panel__intro">${intro}</p>`;
}
const emptyMsg = (t) => `<div class="empty">${t}</div>`;

/* ---- Panel renderers ------------------------------------------------ */
function renderBrand() {
  return `${panelHead("Brand &amp; contact", "Shown in the header and footer of every page.")}
    <div class="card">
      <div class="grid-2">
        ${textField("company", "name", "Company name")}
        ${textField("company", "tagline", "Tagline", { ph: "e.g. 50m luxury dive liveaboard" })}
        ${textField("company", "boatName", "Boat name")}
        ${textField("company", "location", "Departure location")}
        ${textField("company", "phone", "Phone")}
        ${textField("company", "email", "Email")}
      </div>
      ${textareaField("company", "intro", "Intro paragraph", { hint: "shown on the home page", rows: 4 })}
    </div>
    <div class="card">
      <div class="card__bar"><span class="card__title">Social links</span></div>
      <div class="grid-3">
        ${textField("social", "instagram", "Instagram", { ph: "https://instagram.com/…" })}
        ${textField("social", "facebook", "Facebook", { ph: "https://facebook.com/…" })}
        ${textField("social", "youtube", "YouTube", { ph: "https://youtube.com/…" })}
      </div>
      <p class="panel__intro" style="margin:12px 0 0;">Leave a field empty to hide that icon.</p>
    </div>
    <div class="card">
      <div class="card__bar"><span class="card__title">Booking form</span></div>
      <p class="panel__intro" style="margin:0 0 14px;">
        The Book page emails you each request. Get a free access key at
        <a href="https://web3forms.com" target="_blank" rel="noopener">web3forms.com</a>
        (enter your email, copy the key) and paste it below. Requests will arrive at that email.
      </p>
      ${textField("booking", "accessKey", "Web3Forms access key", { ph: "e.g. a1b2c3d4-…", hint: "leave empty to keep the form off" })}
      ${textareaField("booking", "intro", "Form intro text", { rows: 3 })}
      ${textareaField("booking", "successMessage", "Thank-you message", { rows: 2, hint: "shown after a request is sent" })}
    </div>`;
}

function renderTrips() {
  const items =
    state.trips.map((t, i) => tripItem(t, i)).join("") || emptyMsg("No trips yet — add your first expedition.");
  return (
    panelHead(
      "Trips",
      "Expeditions shown on the Trips page. Tick “feature” to show one on the home page.",
      "trips",
      "Add trip"
    ) + items
  );
}
function tripItem(t, i) {
  return `<div class="item">
    <div class="item__head">
      <span class="item__name">🧭 ${esc(t.name || "Untitled trip")} ${t.featured ? '<span class="pill">Featured</span>' : ""}</span>
      <button class="icon-btn" data-remove="trips" data-index="${i}">Remove</button>
    </div>
    <div class="grid-2">
      ${textField("trips", "name", "Name", { index: i })}
      ${textField("trips", "destination", "Destination", { index: i })}
      ${numberField("trips", "nights", "Nights", { index: i })}
      ${numberField("trips", "priceFrom", "Price from", { index: i })}
      ${textField("trips", "currency", "Currency", { index: i, ph: "USD" })}
      ${textField("trips", "id", "ID", { index: i, hint: "links & schedule — no spaces" })}
    </div>
    ${checkField("trips", "featured", "Feature on the home page", { index: i })}
    ${imageField("trips", "image", "Photo", { index: i })}
    ${textareaField("trips", "summary", "Summary", { index: i })}
    ${linesField("trips", "highlights", "Highlights", { index: i, hint: "one per line" })}
    ${linesField("trips", "itinerary", "Day-by-day itinerary", { index: i, hint: "one line per day" })}
  </div>`;
}

function renderDepartures() {
  const tripOpts = state.trips.map((t) => [t.id, t.name]);
  const statusOpts = [
    ["available", "Available"],
    ["limited", "Few spots left"],
    ["soldout", "Sold out"]
  ];
  const items =
    state.departures.map((d, i) => departureItem(d, i, tripOpts, statusOpts)).join("") ||
    emptyMsg("No departures yet — add one.");
  return (
    panelHead(
      "Schedule",
      "Each row is a departure. The return date is calculated automatically from the trip's length.",
      "departures",
      "Add departure"
    ) + items
  );
}
function departureItem(d, i, tripOpts, statusOpts) {
  return `<div class="item">
    <div class="item__head"><span class="item__name">🗓️ Departure ${i + 1}</span>
      <button class="icon-btn" data-remove="departures" data-index="${i}">Remove</button></div>
    <div class="grid-3">
      ${selectField("departures", "tripId", "Expedition", tripOpts, { index: i })}
      ${dateField("departures", "depart", "Departure date", { index: i })}
      ${selectField("departures", "status", "Availability", statusOpts, { index: i })}
    </div>
  </div>`;
}

function renderCabins() {
  const items =
    state.cabins.map((c, i) => cabinItem(c, i)).join("") || emptyMsg("No cabins yet — add one.");
  return panelHead("Cabins", "Shown on the About-the-boat page.", "cabins", "Add cabin") + items;
}
function cabinItem(c, i) {
  return `<div class="item">
    <div class="item__head"><span class="item__name">🛏️ ${esc(c.name || "Cabin")}</span>
      <button class="icon-btn" data-remove="cabins" data-index="${i}">Remove</button></div>
    <div class="grid-3">
      ${textField("cabins", "name", "Name", { index: i })}
      ${textField("cabins", "occupancy", "Occupancy", { index: i, ph: "2 guests" })}
      ${numberField("cabins", "priceFrom", "Price from (per person)", { index: i })}
    </div>
    ${imageField("cabins", "image", "Photo", { index: i })}
    ${linesField("cabins", "features", "Features", { index: i, hint: "one per line" })}
  </div>`;
}

function renderAmenities() {
  const items =
    state.amenities.map((a, i) => amenityItem(a, i)).join("") || emptyMsg("No amenities yet — add one.");
  return (
    panelHead("Amenities", "The “on board” feature cards on the boat page.", "amenities", "Add amenity") +
    items
  );
}
function amenityItem(a, i) {
  return `<div class="item">
    <div class="item__head"><span class="item__name">✨ ${esc(a.title || "Amenity")}</span>
      <button class="icon-btn" data-remove="amenities" data-index="${i}">Remove</button></div>
    <div class="grid-2">
      ${textField("amenities", "icon", "Icon (emoji)", { index: i, ph: "🤿" })}
      ${textField("amenities", "title", "Title", { index: i })}
    </div>
    ${textareaField("amenities", "text", "Description", { index: i })}
  </div>`;
}

function renderCrew() {
  const items = state.crew.map((m, i) => crewItem(m, i)).join("") || emptyMsg("No crew yet — add someone.");
  return panelHead("Crew", "The team shown on the boat page.", "crew", "Add crew member") + items;
}
function crewItem(m, i) {
  return `<div class="item">
    <div class="item__head"><span class="item__name">👤 ${esc(m.name || "Crew member")}</span>
      <button class="icon-btn" data-remove="crew" data-index="${i}">Remove</button></div>
    <div class="grid-2">
      ${textField("crew", "name", "Name", { index: i })}
      ${textField("crew", "role", "Role", { index: i })}
    </div>
    ${imageField("crew", "image", "Photo", { index: i })}
    ${textareaField("crew", "bio", "Short bio", { index: i })}
  </div>`;
}

function renderGallery() {
  const items = state.gallery.length
    ? state.gallery
        .map(
          (src, i) => `<div class="item">
        <div class="item__head"><span class="item__name">🖼️ Photo ${i + 1}</span>
          <button class="icon-btn" data-remove="gallery" data-index="${i}">Remove</button></div>
        ${imageField("gallery", "__self", "Image path or URL", { index: i })}
      </div>`
        )
        .join("")
    : emptyMsg("No photos yet — add one.");
  return (
    panelHead(
      "Gallery",
      "Photos on the About-the-boat page. Use <code>images/your-file.jpg</code> for your own uploads, or a full https:// link.",
      "gallery",
      "Add photo"
    ) + items
  );
}

const RENDERERS = {
  brand: renderBrand,
  trips: renderTrips,
  departures: renderDepartures,
  cabins: renderCabins,
  amenities: renderAmenities,
  crew: renderCrew,
  gallery: renderGallery
};

function renderPanel(name) {
  const el = document.querySelector(`[data-panel="${name}"]`);
  if (!el || !RENDERERS[name]) return;
  el.innerHTML = RENDERERS[name]();
  hydrate(el);
}
function renderAll() {
  Object.keys(RENDERERS).forEach(renderPanel);
}

/* ---- Binding: state <-> inputs -------------------------------------- */
function objFor(scope, index) {
  if (scope === "company") return state.company;
  if (scope === "social") {
    state.company.social = state.company.social || {};
    return state.company.social;
  }
  if (scope === "booking") {
    state.booking = state.booking || {};
    return state.booking;
  }
  if (scope === "root") return state;
  return state[scope][+index];
}

function hydrate(container) {
  container.querySelectorAll("[data-scope]").forEach((el) => {
    const { scope, field, type, index } = el.dataset;
    let v = field === "__self" ? state[scope][+index] : (objFor(scope, index) || {})[field];
    if (type === "lines") el.value = Array.isArray(v) ? v.join("\n") : "";
    else if (el.type === "checkbox") el.checked = !!v;
    else el.value = v == null ? "" : v;

    const box = el.closest(".imgfield");
    if (box) box.querySelector(".thumb").src = el.value || PLACEHOLDER;
  });
}

function onFieldChange(e) {
  const el = e.target.closest("[data-scope]");
  if (!el) return;
  const { scope, field, type, index } = el.dataset;

  let value;
  if (el.type === "checkbox") value = el.checked;
  else if (type === "number") value = el.value === "" ? 0 : Number(el.value);
  else if (type === "lines")
    value = el.value
      .split("\n")
      .map((s) => s.replace(/\s+$/, ""))
      .filter((s) => s.trim().length > 0);
  else value = el.value;

  if (field === "__self") state[scope][+index] = value;
  else {
    const obj = objFor(scope, index);
    if (obj) obj[field] = value;
  }

  const box = el.closest(".imgfield");
  if (box) box.querySelector(".thumb").src = el.value || PLACEHOLDER;

  scheduleSave();
}

/* ---- Add / remove list items ---------------------------------------- */
const NEW_ITEM = {
  trips: () => ({
    id: "trip-" + Date.now(),
    name: "New expedition",
    destination: "",
    nights: 7,
    priceFrom: 0,
    currency: "USD",
    featured: false,
    image: "",
    summary: "",
    highlights: [],
    itinerary: []
  }),
  departures: () => ({
    tripId: (state.trips[0] && state.trips[0].id) || "",
    depart: new Date().toISOString().slice(0, 10),
    status: "available"
  }),
  cabins: () => ({ name: "New cabin", occupancy: "2 guests", priceFrom: 0, image: "", features: [] }),
  amenities: () => ({ icon: "✨", title: "New amenity", text: "" }),
  crew: () => ({ name: "New crew member", role: "", image: "", bio: "" }),
  gallery: () => ""
};

function addItem(key) {
  if (!state[key]) state[key] = [];
  state[key].push(NEW_ITEM[key]());
  renderPanel(key);
  scheduleSave();
  const panel = document.querySelector(`[data-panel="${key}"]`);
  const last = panel && panel.querySelectorAll(".item");
  if (last && last.length) last[last.length - 1].scrollIntoView({ behavior: "smooth", block: "center" });
}

function removeItem(key, i) {
  const label = { trips: "trip", departures: "departure", cabins: "cabin", amenities: "amenity", crew: "crew member", gallery: "photo" }[key];
  if (!confirm(`Remove this ${label}? You can undo by using Reset before publishing.`)) return;
  state[key].splice(i, 1);
  renderPanel(key);
  scheduleSave();
}

/* ---- Publish / import / reset --------------------------------------- */
function downloadFile(name, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildDataJs() {
  const header =
    "/* ============================================================================\n" +
    " *  " + (state.company.name || "Site") + " — website content\n" +
    " *  Saved from the Manage dashboard on " + new Date().toLocaleString() + ".\n" +
    " *  This file holds everything shown on the site. You can hand-edit it too.\n" +
    " * ============================================================================ */\n\n";
  return header + "const SITE = " + JSON.stringify(state, null, 2) + ";\n";
}

function exportDataJs() {
  downloadFile("data.js", buildDataJs(), "text/javascript");
}

/* ---- Online publishing (writes data.js to GitHub) ------------------- */
function renderGhPanel() {
  const el = document.getElementById("gh-panel");
  if (!el) return;

  if (ghGetToken()) {
    el.innerHTML = `
      <p>✅ Connected to <strong>${GH_CONFIG.owner}/${GH_CONFIG.repo}</strong>.
      Publishing sends your changes to the live site — visible to everyone in about a minute.</p>
      <div class="modal__actions">
        <button class="abtn abtn--gold" id="btn-publish-online">↑ Publish online now</button>
        <button class="abtn abtn--danger" id="btn-disconnect">Disconnect</button>
      </div>
      <p id="gh-result" class="panel__intro" style="margin-top:12px;"></p>`;
    document.getElementById("btn-publish-online").addEventListener("click", publishOnline);
    document.getElementById("btn-disconnect").addEventListener("click", () => {
      ghClearToken();
      renderGhPanel();
    });
  } else {
    el.innerHTML = `
      <p>Connect once to publish straight to your live site. Your token is stored only in this
      browser — never in the site's code.</p>
      <ol>
        <li>Open <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener">GitHub → Fine-grained tokens</a> → <em>Generate new token</em>.</li>
        <li><strong>Repository access</strong> → Only select repositories → <strong>${GH_CONFIG.repo}</strong>.</li>
        <li><strong>Permissions</strong> → Repository permissions → <strong>Contents: Read and write</strong>.</li>
        <li>Generate, copy the token, paste it below, and click Connect.</li>
      </ol>
      <div class="field"><label>Access token</label>
        <input type="password" id="gh-token" placeholder="github_pat_…" autocomplete="off"></div>
      <div class="modal__actions">
        <button class="abtn abtn--gold" id="btn-connect">Connect</button>
      </div>
      <p id="gh-result" class="panel__intro" style="margin-top:12px;"></p>`;
    document.getElementById("btn-connect").addEventListener("click", connectGithub);
    const input = document.getElementById("gh-token");
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") connectGithub();
    });
  }
}

async function connectGithub() {
  const input = document.getElementById("gh-token");
  const result = document.getElementById("gh-result");
  const token = (input.value || "").trim();
  if (!token) {
    result.textContent = "Please paste your token first.";
    return;
  }
  ghSetToken(token);
  result.textContent = "Checking…";
  try {
    await ghVerify();
    renderGhPanel();
  } catch (err) {
    ghClearToken();
    renderGhPanel();
    const r = document.getElementById("gh-result");
    if (r) r.textContent = "Couldn't connect: " + err.message;
  }
}

async function publishOnline() {
  const result = document.getElementById("gh-result");
  const btn = document.getElementById("btn-publish-online");
  if (btn) btn.disabled = true;
  if (result) result.textContent = "Publishing…";
  setStatus("Publishing to your live site…", "is-dirty");
  try {
    await ghPutFile(buildDataJs(), "Update site content via admin — " + new Date().toLocaleString());
    if (result) result.textContent = "✅ Published! Your live site will show the changes in about a minute.";
    setStatus("Published to your live site", "");
  } catch (err) {
    if (result) result.textContent = "❌ " + err.message;
    setStatus("Publish failed", "is-error");
  } finally {
    if (btn) btn.disabled = false;
  }
}

function importFromFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      let text = String(reader.result).trim();
      // Accept either a .json file or an exported data.js (const SITE = {...};).
      const m = text.match(/const\s+SITE\s*=\s*([\s\S]*?);?\s*$/);
      if (m) text = m[1];
      const parsed = JSON.parse(text);
      if (!parsed || !parsed.company || !Array.isArray(parsed.trips)) throw new Error("bad shape");
      state = parsed;
      saveSiteData(state);
      renderAll();
      setStatus("Imported — changes saved", "");
    } catch (err) {
      alert("Sorry, that file couldn't be read. Please choose a backup .json or an exported data.js file.");
    }
  };
  reader.readAsText(file);
}

function resetAll() {
  if (!confirm("Discard your local edits and reload the published content? This can't be undone.")) return;
  clearSiteData();
  state = deepClone(SITE);
  renderAll();
  setStatus("Reset to published content", "");
}

/* ---- Navigation ----------------------------------------------------- */
function setActivePanel(name) {
  document.querySelectorAll("#admin-nav button").forEach((b) => b.classList.toggle("active", b.dataset.target === name));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.dataset.panel === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---- Boot ----------------------------------------------------------- */
function init() {
  if (!state) {
    document.querySelector(".admin-main").innerHTML =
      '<div class="empty">Could not load content. Make sure <code>js/data.js</code> is present.</div>';
    return;
  }
  // Make sure optional collections exist so the panels never crash.
  ["trips", "departures", "cabins", "amenities", "crew", "gallery"].forEach((k) => {
    if (!Array.isArray(state[k])) state[k] = [];
  });
  state.company = state.company || {};
  state.company.social = state.company.social || {};
  state.booking = state.booking || {};

  renderAll();

  document.addEventListener("input", onFieldChange);
  document.addEventListener("change", onFieldChange);

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) return addItem(add.dataset.add);
    const rm = e.target.closest("[data-remove]");
    if (rm) return removeItem(rm.dataset.remove, +rm.dataset.index);
  });

  document.getElementById("admin-nav").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-target]");
    if (b) setActivePanel(b.dataset.target);
  });

  const modal = document.getElementById("publish-modal");
  document.getElementById("btn-publish").addEventListener("click", () => {
    renderGhPanel();
    modal.classList.add("open");
  });
  document.getElementById("btn-close-modal").addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });
  document.getElementById("btn-download").addEventListener("click", exportDataJs);
  document.getElementById("btn-download-json").addEventListener("click", () =>
    downloadFile("ocean-explorer-content.json", JSON.stringify(state, null, 2), "application/json")
  );

  const fileInput = document.getElementById("import-file");
  document.getElementById("btn-import").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    if (e.target.files[0]) importFromFile(e.target.files[0]);
    e.target.value = "";
  });

  document.getElementById("btn-reset").addEventListener("click", resetAll);

  setStatus(hasLocalEdits() ? "Loaded your saved edits" : "Loaded published content", "");
}

document.addEventListener("DOMContentLoaded", init);
