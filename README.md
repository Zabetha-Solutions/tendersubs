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

## Connecting the submission form (Formspree)

`submit.html` posts to [Formspree](https://formspree.io), a free service that
forwards form submissions (including uploaded documents) to your email
without needing a backend server.

1. Create a free account at [formspree.io](https://formspree.io).
2. Create a new form and set its notification email to the address that
   should receive tender submissions.
3. Copy the form's endpoint ID — the part after `/f/` in
   `https://formspree.io/f/xxxxxxxx`.
4. Open `assets/js/config.js` and replace `YOUR_FORM_ID` with that ID:

   ```js
   window.ZABETHA_CONFIG = {
     formspreeId: "xxxxxxxx",
     contactEmail: "your-email@example.com",
   };
   ```

5. Commit and push. Submissions (including uploaded files, up to Formspree's
   plan limits) will now be emailed to you.

Until `formspreeId` is set, `submit.html` shows a setup notice instead of
silently failing.

## Local preview

No build step is needed. From the project root, run any static file server, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Customizing

- **Branding / colors** — edit the CSS variables at the top of `assets/css/style.css`.
- **Sector checklists** — edit the content in `sectors.html` and the sector cards in `index.html`.
- **Form fields** — edit `submit.html`; each `<input>`/`<select>`/`<textarea>` `name` attribute becomes the field label in the email Formspree sends you.
- **Contact details** — update the email address in `about.html` and `assets/js/config.js`.
