# Presly

**Real-estate ERP for plots, bookings and commission.**

Presly Estate is operational software for developers, builders and brokerages who
sell land and buildings. It puts live plot inventory, the sales pipeline,
bookings and an automated commission engine on one data model — so the number
your Monday meeting argues about is already the number in the system.

> We build the software that runs the business, not the website that advertises it.

---

## The problem

Spreadsheets do not scale past one project. Once a company runs two ventures and
three sales agents, four things break in the same week:

- **Nobody agrees on what is available.** Inventory lives in a spreadsheet, the
  site office has a different copy, and two agents sell the same plot.
- **Leads die in someone's phone.** Enquiries arrive from a website form, a
  walk-in and a broker's WhatsApp, and none of them have a recorded next step.
- **Commission is a monthly argument.** Payouts are recalculated by hand from
  rates everyone remembers slightly differently.
- **Reporting is reassembled each time.** Three reports disagree, and someone
  spends Friday reconciling them.

Presly Estate replaces the reconciliation step by making the plot the single
source of truth and deriving everything else from it.

---

## What it does

### Plot and inventory management
Project hierarchy across ventures, phases and blocks. Plot and unit records,
configurable pricing engine with premium rules (corner, facing, road width),
availability matrix, an explicit inventory status model, bulk price revision,
price list generation and inventory ageing.

### Leads and customers
Lead capture from any source, a configurable pipeline, assignment and
round-robin, duplicate detection, an activity timeline, follow-ups and
reminders, site visits and opportunities. Leads convert into customer master
records with joint ownership support and lost-deal reasons captured for
analysis.

### Bookings and registration
Time-boxed holds with automatic expiry, hold extension and release, booking
creation with discount approval and double-click protection (two salespeople,
one plot, no disaster), agreement and registration tracking, cancellation and
refund handling, transfer and nominee change, and booking documents.

### Payments and collections
Payment plan templates, instalment tracking, receipts and part-payments,
overdue visibility, automated reminders, refunds and adjustments, collections
by project, interest and penalty rules, and accounting export.

### The commission engine
The module people ask about first. Rule configuration, a basis snapshot taken
at booking so later price changes cannot rewrite history, payout runs, agent
statements, channel partner payouts, disputes and adjustments, recovery on
cancellation, tax-ready output and a full audit trail.

A payout run can be defended line by line.

### 3D plot visualisation
An interactive layout with live status colours, roads and boundaries, buyer
shortlists and dimension overlays — rendered in the browser with no plugin.
Sell the location, not the plot number.

### Reports
Sales summary, inventory status and ageing, lead source performance, pipeline
health, agent productivity, collections, commission register, discount analysis
and cancellation analysis — plus custom exports and scheduled delivery. Reports
that agree with each other.

### Roles and security
Hierarchy-aware access, role templates, approval limits, audit trail and secure
sign-in. Reassignment without loss of history. Five roles see five different
screens: managing director, sales head, sales agent, finance, site office, and
legal.

### Data and integrations
Company-level isolation, encryption in transit and at rest, a choice of cloud or
your own servers, backups and recovery, and data ownership with full export. A
REST API, webhooks, accounting integration, website lead capture, business
messaging, import tools and multi-company support.

---

## Packages

| Package | For |
|---|---|
| **Starter** | A single project or venture. Prove it with your sales team, then add modules. |
| **Growth** | Multi-venture developers. Growth without renegotiation. |
| **Enterprise** | Groups and multi-entity firms. |

Pricing is scoped **per company**, not per seat you forgot to count — by plot
count, users and modules. Quotes are written and itemised.

---

## How a rollout goes

1. **Scoping call** — your process, not our template.
2. **Written proposal** — itemised, before anything is built.
3. **Data import** — your existing inventory and ledgers.
4. **Configuration** — pricing rules, pipeline stages, approval limits.
5. **Team training** — per role.
6. **Go live & support** — we stay after go-live.

---

## Principles

- **Enforce, don't just record.** The system should make the wrong booking
  impossible, not merely log it afterwards.
- **Operators know their process better than we do.** Presly is configured to
  how your company actually sells.
- **Honesty is a sales strategy.** Scoped, itemised proposals and documented
  scope.
- **No lock-in, ever.** Data ownership and export are defaults, not upgrades.

Real estate is where Presly is. Not where it stops.

---

## Contact

- **Email** — contact@presly.de
- **Website** — https://www.presly.de
- **Demo** — see Presly Estate running on your own projects

Legal notice and privacy policy: `/impressum.html` and `/datenschutz.html`
(§5 TMG and GDPR, German requirements).

---

## This repository

The marketing site for Presly, published at **https://www.presly.de**.

```
index.html          Overview and value proposition
product.html        Guided product tour with interface views
features.html       Complete feature reference
pricing.html        Packages and quote request
about.html          Company, principles, roadmap
contact.html        Demo and pricing enquiries
impressum.html      Legal notice (Impressum)
datenschutz.html    Privacy policy
404.html            Not-found page
assets/
  css/presly.css    Site styles
  js/main.js        Site behaviour
  fonts/            Self-hosted Inter + Source Serif
  img/              Icons and Open Graph art
  vendor/bootstrap/ Vendored Bootstrap 5
```

A static HTML/CSS/JS site with no build step. Any static file server works:

```
python -m http.server 8080
```
