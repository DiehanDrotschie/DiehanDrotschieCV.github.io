# Bar Valley Properties — Real Estate Website (Propagen Client Template)

**Repo:** github.com/DiehanDrotschie/propagen-client-website-template
**Live stack:** React 19 · Vite 7 · Tailwind CSS 4 · React Router 7 · Airtable · Vercel Serverless Functions

## Summary

A production-ready real estate listings website built as a reusable client template for **Propagen**, an n8n-based automation agency. The first deployment is for Bar Valley Properties, a real estate agency in Robertson, Western Cape, South Africa. All property listings and agent data are pulled live from an Airtable base — there is no traditional database. The site is designed to be re-skinned and re-pointed at a new Airtable base for each future Propagen client rather than rebuilt from scratch.

## What it does

- Public-facing marketing site with home, listings, property detail, about, and contact pages
- Live property search and filtering (suburb, price range, type, sale vs. rental) served entirely client-side after a single cached fetch — no network round-trip per filter change
- Full property detail pages: photo carousel, pricing, specs, financial breakdown (levies, rates, estimated rental income), and a WhatsApp-based enquiry flow that resolves the listing agent server-side
- Agent directory pulled live from Airtable, with a static fallback if the API is unavailable
- Fully responsive — a single React codebase serves both desktop and mobile, verified down to 390px width

## Architecture decisions worth highlighting

- **Airtable API key never reaches the browser.** All Airtable calls go through Vercel serverless functions (`/api/listings`, `/api/listing`, `/api/agents`, `/api/agent`, `/api/enquire`) that hold the credential server-side and proxy sanitized JSON to the client.
- **PII stripping at the API boundary.** Listing records carry internal-only fields (agent record links, owner name/email/phone) that are explicitly stripped out before a response ever leaves the server — the browser only ever sees public-safe fields.
- **Enquiry form never exposes agent emails.** The WhatsApp/enquiry flow looks up the correct agent's email server-side and forwards it to an n8n booking workflow, so no agent contact detail is bundled into client-side JavaScript.
- **Rate limiting on public API routes**, wired through `@vercel/firewall`, with an explicit fail-open policy so a rate-limiter outage never takes the whole site down — a deliberate availability-over-strictness tradeoff, documented inline in the code.
- **Security headers** (CSP-adjacent headers, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`) configured at the Vercel edge via `vercel.json`.
- **Local dev without the Vercel CLI.** A custom Vite plugin (`vite-api-plugin.js`) reimplements just enough of the Vercel serverless request/response contract to run the same `/api/*` handlers directly inside `vite dev` — no need to install or authenticate the Vercel CLI just to develop locally.
- **Client-side caching layer** — listings (30 min TTL) and agents (1 hour TTL) are cached in `localStorage`, with automatic invalidation when cached Airtable photo URLs have expired, keeping the UI fast without over-fetching a rate-limited third-party API.
- **Templatable by design.** Colours, fonts, copy, and Airtable table names are all configuration, not hardcoded — the explicit goal is to onboard a new Propagen real estate client by swapping config and Airtable credentials, not by forking and rewriting.

## My role

Designed and built the frontend and the serverless API layer end-to-end: React component architecture, Airtable data-fetching hooks and caching strategy, the Vercel functions and their security posture (PII stripping, rate limiting, header hardening), and the local-dev tooling (the custom Vite API plugin) that let the team iterate without needing Vercel CLI access.

## Screenshots

| File | Shows |
| --- | --- |
| `01-home-hero.png` | Homepage hero with the property search bar |
| `02-home-full.png` | Full homepage — featured listings, rentals, stats bar, category browse, CTA |
| `03-listings.png` | Listings page — live Airtable data, sale/rent toggle, filters |
| `04-listings-rent.png` | Listings page filtered to rentals |
| `05-about.png` | About page — agency story and live team from Airtable |
| `06-contact.png` | Contact page |
| `07-property-detail.png` | Full property detail page — carousel, pricing, financials, WhatsApp enquiry |
| `08-mobile-home.png` | Mobile viewport (390px) — responsive layout |

*Screenshots were captured against a local dev instance connected to the live Airtable base, so listing data shown is real seeded content, not mocked.*
