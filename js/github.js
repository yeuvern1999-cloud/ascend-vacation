/* ==========================================================================
   OCEAN EXPLORER / ASCEND VACATION — GitHub publishing
   --------------------------------------------------------------------------
   Lets the Manage dashboard write js/data.js straight to your GitHub repo, so
   your live site updates (~1 minute later) without any manual re-upload.

   Security notes:
   - Your access token is stored ONLY in this browser (localStorage). It is
     never written into the site's code and never leaves your machine except
     in the direct request to GitHub.
   - Use a FINE-GRAINED token limited to this one repository, with
     "Contents: Read and write". You can revoke it anytime on GitHub.
   - Because the admin page is reachable by URL, treat this like a password:
     don't connect on a shared/public computer.
   ========================================================================== */

const GH_CONFIG = {
  owner: "yeuvern1999-cloud",
  repo: "ascend-vacation",
  branch: "main",
  path: "js/data.js"
};

const GH_TOKEN_KEY = "oe_gh_token";

function ghGetToken() {
  try {
    return localStorage.getItem(GH_TOKEN_KEY) || "";
  } catch (e) {
    return "";
  }
}
function ghSetToken(t) {
  try {
    localStorage.setItem(GH_TOKEN_KEY, t);
  } catch (e) {
    /* ignore */
  }
}
function ghClearToken() {
  try {
    localStorage.removeItem(GH_TOKEN_KEY);
  } catch (e) {
    /* ignore */
  }
}

function ghHeaders() {
  return {
    Authorization: "Bearer " + ghGetToken(),
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

/* UTF-8 safe base64 (data.js contains emojis and — dashes). */
function b64EncodeUnicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

/* Confirms the token works and can see the repo. */
async function ghVerify() {
  const res = await fetch(`https://api.github.com/repos/${GH_CONFIG.owner}/${GH_CONFIG.repo}`, {
    headers: ghHeaders()
  });
  if (res.status === 401) throw new Error("Token was rejected (401). Double-check you pasted it correctly.");
  if (res.status === 404)
    throw new Error("Repo not found (404). Make sure the token has access to " + GH_CONFIG.repo + ".");
  if (!res.ok) throw new Error("GitHub returned " + res.status + ".");
  return res.json();
}

/* Current file SHA is required to update an existing file. */
async function ghGetFileSha() {
  const url = `https://api.github.com/repos/${GH_CONFIG.owner}/${GH_CONFIG.repo}/contents/${GH_CONFIG.path}?ref=${GH_CONFIG.branch}`;
  const res = await fetch(url, { headers: ghHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Couldn't read the current file (" + res.status + ").");
  const data = await res.json();
  return data.sha;
}

/* Commits new content to js/data.js on the repo. */
async function ghPutFile(contentStr, message) {
  const sha = await ghGetFileSha();
  const url = `https://api.github.com/repos/${GH_CONFIG.owner}/${GH_CONFIG.repo}/contents/${GH_CONFIG.path}`;
  const body = {
    message: message || "Update site content via admin",
    content: b64EncodeUnicode(contentStr),
    branch: GH_CONFIG.branch
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    let msg = "Publish failed (" + res.status + ").";
    if (res.status === 409) msg = "Someone/something changed the file first — click Publish again to retry.";
    try {
      const e = await res.json();
      if (e.message) msg += " " + e.message;
    } catch (_) {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json();
}
