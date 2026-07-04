# Ascend Vacation — Liveaboard Website

A fast, modern, browse-only website for a liveaboard diving & sailing company.
Built with plain HTML, CSS and JavaScript — **no build tools, no installation**.
Just open it in a browser or upload the files to any host.

## Pages

| Page            | File            | What it shows                                   |
| --------------- | --------------- | ----------------------------------------------- |
| Home            | `index.html`    | Hero, intro, why-us, featured trips             |
| Trips           | `trips.html`    | All expeditions with day-by-day itineraries     |
| Schedule        | `schedule.html` | Upcoming departures with availability badges    |
| The Boat        | `boat.html`     | Cabins, amenities, crew and a photo gallery     |

## View the site

**Easiest:** double-click `index.html` to open it in your browser.

**Recommended (so everything loads exactly like it will online):** run a tiny
local server from this folder, then visit the address it prints.

```powershell
# If you have Python installed:
python -m http.server 8000
# then open http://localhost:8000

# Or with Node.js:
npx serve
```

## Editing your content — two ways

### 1. The Manage dashboard (recommended, no coding)

Open **`manage.html`** in your browser (there's also a small “Manage site” link in
the footer of every page). It gives you friendly forms to edit everything:

- **Brand & contact** — name, tagline, boat name, phone, email, location, socials
- **Trips** — add/edit/remove expeditions, prices, highlights, itineraries, photos
- **Schedule** — add/edit/remove departures, dates and availability
- **Cabins, Amenities, Crew, Gallery** — full add/edit/remove with photo previews

How it saves:

- Edits are stored **in your browser** and the site preview updates immediately.
- Click **Publish changes**, then **Publish online** to send changes straight to your
  live site (GitHub) — it updates for everyone in about a minute, no re-upload needed.
- Or click **Download data.js** as a backup / to upload manually.
- **Import** loads a `.json` backup or an exported `data.js`. **Reset** restores the
  currently published content.

### Publish online (edit the live site from anywhere)

The dashboard is deployed at your **hidden admin URL**:

```
https://yeuvern1999-cloud.github.io/ascend-vacation/manage.html
```

Bookmark it. To enable one-click online publishing you connect once with a GitHub
token (stored **only in your browser**, never in the code):

1. In the dashboard, click **Publish changes** → follow the on-screen steps to create a
   **fine-grained token** at GitHub → Settings → Developer settings → Fine-grained tokens.
2. Give it access to **only the `ascend-vacation` repo**, with **Contents: Read and write**.
3. Paste it, click **Connect**, then use **Publish online** whenever you want changes to go live.

> Security: treat that token like a password — don't connect on a shared computer, and
> you can revoke it anytime on GitHub. Because the token is limited to this one repo, a
> leak could at worst let someone edit this website (not your whole account).

> Tip: for the in-browser preview to work reliably, view the site through a local
> server (see below) rather than opening files directly.

### 2. Editing `js/data.js` by hand

You can still edit `js/data.js` directly in a text editor — everything is labelled
and you just change the text between the quotes.

> Departure dates use the format `"YYYY-MM-DD"` (e.g. `"2026-08-14"`).
> The return date is worked out automatically from the trip's number of nights.

### Photos

- **Your boat renders** are already cropped from the design spec sheet and live in
  the `images/` folder (`boat-hero.png`, `boat-side.png`, `boat-front.png`,
  `boat-aft.png`). They're used for the home hero, the About-the-boat page and the
  gallery. `boat-scheme.png` is the original spec sheet, kept for reference.
- **Cabin interiors, crew portraits and reef shots** are still online placeholders.
  To use your own: drop a photo into `images/` and, in `js/data.js`, replace the
  image link with `"images/your-photo.jpg"`.

> The site's colours match the MV Ocean Explorer livery (deep navy, champagne gold,
> cream, warm gray). You can tweak them at the top of `css/styles.css`.

## Hosting it online (free options)

All of these accept a plain folder of files like this one:

- **Netlify** — drag-and-drop this folder onto app.netlify.com
- **GitHub Pages** — push these files to a repo and enable Pages
- **Cloudflare Pages** / **Vercel** — connect the folder/repo and deploy

## Project structure

```
Vessel/
├── index.html        Home
├── trips.html        Expeditions
├── schedule.html     Departure schedule
├── boat.html         About the boat
├── manage.html       ← Manage dashboard (edit content, no coding)
├── css/
│   ├── styles.css    Site styling (palette variables at the top)
│   └── admin.css     Manage dashboard styling
├── js/
│   ├── data.js       ← YOUR CONTENT (published defaults)
│   ├── store.js      Bridges saved edits with the published content
│   ├── main.js       Site behaviour (rarely needs editing)
│   ├── admin.js      Manage dashboard behaviour
│   └── github.js     Online publishing to your GitHub repo
├── images/           Boat photos (cropped from your spec sheet)
└── README.md
```

## What's next?

This version is **browse-only**, but you can now edit content online and publish to the
live site from the dashboard. Natural next steps are:

1. A **contact / enquiry form** so guests can request a spot.
2. **Online booking with payments** (e.g. Stripe deposits).
3. A **custom domain** (e.g. `ascendvacation.com`) pointed at GitHub Pages.

Just say the word and we can add any of these.
