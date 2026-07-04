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
| Book            | `book.html`     | Booking request form (emails each request to you) |

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

Open **`manage.html`** in your browser (the URL is unlisted — bookmark it). It gives
you friendly forms to edit everything:

- **Brand & contact** — name, tagline, boat name, phone, email, location, socials,
  and the **Booking form** access key + messages (see “Booking form” below)
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

### Booking form

The **Book** page (`book.html`) lets guests request a spot: they pick an expedition
and departure, add their details, and submit. There's **no payment** — each request is
**emailed to you** so you can confirm availability and follow up.

It uses [Web3Forms](https://web3forms.com) (free), which works on a static site with no
backend. To switch it on:

1. Go to **web3forms.com**, enter the email where you want to receive requests, and copy
   the **Access Key** it gives you.
2. In the Manage dashboard → **Brand & contact → Booking form**, paste the key into
   **Web3Forms access key** (or set `booking.accessKey` in `js/data.js`).
3. **Publish** — that's it. Test it by sending yourself a request from the Book page.

Until a key is added, the form validates and shows a friendly "not connected yet" note
instead of sending. The access key is safe to keep in the code — it only lets the form
email you; it can't read anything.

> "Book this trip" buttons on the Trips/Home cards pre-select that expedition on the
> booking form via a `?trip=` link.

### 2. Editing `js/data.js` by hand

You can still edit `js/data.js` directly in a text editor — everything is labelled
and you just change the text between the quotes.

> Departure dates use the format `"YYYY-MM-DD"` (e.g. `"2026-08-14"`).
> The return date is worked out automatically from the trip's number of nights.

### Photos

- **Your boat photos** live in the `images/` folder: `boat-sea.jpg` (home hero),
  `boat-side.jpg` (boat page + intro + gallery), and `boat-whole.jpg` (the annotated
  design spec sheet, kept for reference — not shown on the public site).
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
├── book.html         Booking request form
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

Guests can now **browse and request bookings** (emailed to you), and you can edit
content online and publish to the live site from the dashboard. Natural next steps:

1. **Online booking with payments** (e.g. Stripe deposits) — needs a small backend.
2. A **custom domain** (e.g. `ascendvacation.com`) pointed at GitHub Pages.
3. **Automatic availability** that marks departures sold out once full.

Just say the word and we can add any of these.
