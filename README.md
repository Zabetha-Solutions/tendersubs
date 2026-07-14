# Zabetha Solutions — Tender Submission Portal

A static website that gives bidders one guided place to submit tender
documents for **government, municipal, construction, mining and
private-sector** opportunities. Built with plain HTML/CSS/JS so it can be
hosted directly on GitHub Pages — no build step, no server required.

## Pages

- `index.html` — landing page with an overview of all sectors and how submission works
- `sectors.html` — per-sector guide to typical required documents
- `submit.html` — the tender submission form (company details, tender reference, document upload)
- `about.html` — about the portal and contact details

## Hosting on GitHub Pages

1. Push this repository to GitHub (already done if you're reading this from the repo).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Choose the branch this site lives on (e.g. `main`) and folder `/ (root)`, then **Save**.
5. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a few minutes
   (e.g. `https://zabetha-solutions.github.io/tendersubs/`).

No build tooling is required — the site is plain static files.

## Connecting the submission form (FormSubmit.co)

`submit.html` posts to [FormSubmit.co](https://formsubmit.co), a free service
that emails form submissions — including uploaded documents — directly to
you, with no signup, dashboard, or paid plan required for file attachments
(unlike some alternatives, which gate attachments behind a paid tier).

1. Open `assets/js/config.js` and set `contactEmail` to the address that
   should receive tender submissions:

   ```js
   window.ZABETHA_CONFIG = {
     contactEmail: "your-email@example.com",
   };
   ```

2. Commit and push.
3. On the live site, submit the form once yourself (a test submission is
   fine). FormSubmit.co will send a confirmation email to `contactEmail`
   with an **"Activate Form"** link — click it once. This is a one-time
   step; submissions sent before activation won't be delivered.
4. After that, every submission (including attached documents) is emailed
   to you automatically.

Until `contactEmail` is changed from its placeholder value, `submit.html`
shows a setup notice instead of silently failing.

**Note on file size:** FormSubmit.co's free tier has its own attachment
size limits. If a large submission fails to deliver, ask the bidder to
split files across a couple of submissions or compress them into a zip.

## Local preview

No build step is needed. From the project root, run any static file server, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Customizing

- **Branding / colors** — edit the CSS variables at the top of `assets/css/style.css`.
- **Sector checklists** — edit the content in `sectors.html` and the sector cards in `index.html`.
- **Form fields** — edit `submit.html`; each `<input>`/`<select>`/`<textarea>` `name` attribute becomes the field label in the email FormSubmit.co sends you.
- **Contact details** — update the email address in `about.html` and `assets/js/config.js`.
