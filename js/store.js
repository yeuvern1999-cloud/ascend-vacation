/* ==========================================================================
   VESSEL / OCEAN EXPLORER — Content store
   --------------------------------------------------------------------------
   Bridges the "published" content (data.js) with edits made in the Manage
   dashboard. Edits are kept in the browser's localStorage so the public pages
   preview them instantly. To publish for everyone, export data.js from the
   dashboard and upload it to your host.
   ========================================================================== */

const STORAGE_KEY = "oceanExplorerSiteData_v1";

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* Basic shape check so a corrupt/old entry can't break the site. */
function isValidSite(data) {
  return (
    data &&
    typeof data === "object" &&
    data.company &&
    Array.isArray(data.trips) &&
    Array.isArray(data.departures)
  );
}

/* Returns the edited content if present, otherwise the published defaults. */
function loadSiteData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidSite(parsed)) return parsed;
    }
  } catch (e) {
    /* localStorage unavailable (e.g. blocked on file://) — fall back to defaults. */
  }
  return typeof SITE !== "undefined" ? deepClone(SITE) : null;
}

function saveSiteData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

function clearSiteData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

function hasLocalEdits() {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return false;
  }
}
