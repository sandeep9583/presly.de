# presly.de

Marketing site for Presly Estate — a static HTML/CSS/JS site with no build step.

## Structure

```
index.html          Landing page
product.html        Product overview
features.html       Feature breakdown
pricing.html        Plans & pricing
about.html          Company
contact.html        Contact / demo request
impressum.html      Legal notice (Impressum, §5 TMG)
datenschutz.html    Privacy policy (GDPR)
404.html            Not-found page
assets/
  css/presly.css    Site styles
  js/main.js        Site behaviour
  fonts/            Self-hosted Inter + Source Serif (woff2)
  img/              Icons, OG cover art
  vendor/bootstrap/ Vendored Bootstrap 5
```

## Local development

Any static file server works, e.g.:

```
python -m http.server 8080
# or
npx serve .
```

Then open http://localhost:8080.

## Deployment

Hosted on GitHub Pages from the `main` branch, served at the repository root.

- Custom domain: `www.presly.de` (declared in `CNAME`)
- Apex `presly.de` is expected to redirect to the `www` host via DNS
- Pushing to `main` publishes automatically; no CI workflow or bundler involved

## DNS

| Type  | Host | Value                          |
|-------|------|--------------------------------|
| CNAME | www  | `sandeep9583.github.io`        |
| A     | @    | 185.199.108.153                |
| A     | @    | 185.199.109.153                |
| A     | @    | 185.199.110.153                |
| A     | @    | 185.199.111.153                |

## Notes

- Canonical and Open Graph URLs are configured for `https://www.presly.de/`.
- Product screenshots under `assets/img/screenshots/` are referenced by the
  markup but not yet committed; add them there to render the dashboard,
  3D plot, and plot-matrix mockups.
