# Propagen Website

**Repo:** github.com/DiehanDrotschie/propagen-website
**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · HeroUI · Framer Motion

## Summary

A marketing website built with Next.js 16's App Router, covering a multi-page product site: homepage, pricing/comparison page, a product showcase page, and a multi-step lead-capture booking flow with a server-side form-submission API.

## What it does

- Marketing homepage: hero, problem framing, product overview, "how it works" timeline, case study, FAQ, CTA strip
- Pricing page: two-tier pricing cards, a full feature-comparison table, and an onboarding timeline (Discovery → Build → Test & Refine → Go Live → Maintenance)
- Showcase page: theme preview gallery, a full page-by-page product walkthrough, and a scripted, auto-playing two-phone chat conversation simulation
- Multi-step ("About You" → "Your Agency" → "What You Need") lead-capture form that submits through a server-side API route
- Technical SEO: sitemap, robots.txt, canonical URLs, and structured data (`src/lib/seo.ts`, `sitemap.ts`, `robots.ts`)

## Technical highlights

- **Server-side proxy for the form submission endpoint.** The booking form posts to this site's own `/api/book` route handler, which validates required fields server-side and only then forwards the payload to an external webhook read from a non-`NEXT_PUBLIC_` environment variable — the real endpoint URL is never bundled into client-side JS.
- **Typed, layered error handling in the API route.** `/api/book` distinguishes between a malformed request body (400), missing server config (500), and a failed upstream call (502), rather than collapsing everything into a generic error response.
- **A scripted chat animation built as an explicit state machine, not CSS.** `BotShowcase.tsx` drives a turn-by-turn conversation with typing-indicator delays and staggered message reveal via `setTimeout` chains tracked in refs (so they can be cleanly cancelled on unmount), includes a `prefers-reduced-motion` fallback that jumps straight to the finished conversation, and coordinates two independent phone components so only one animates at a time while the other holds its completed state and hands off playback on completion.
- **Component structure organized by marketing section**, not by generic UI atoms — each homepage/pricing/showcase section (Hero, Problem, Product, HowItWorks, CaseStudy, PricingCards, ComparisonTable, BotShowcase, etc.) is a self-contained component under `src/components/sections/`, keeping long pages composable and each section independently testable/reorderable.
- **Copy-accuracy and accessibility fixes as discrete, intentional commits** — e.g. correcting an overstated "no manual refresh needed" claim, fixing a broken hash-link scroll-to-section bug, and fixing a booking-form label accessibility issue — evidence of iterating on shipped work rather than treating first-draft copy/markup as final.

## Screenshots

| File | Shows |
| --- | --- |
| `01-home-hero.png` | Homepage hero |
| `02-home-full.png` | Full homepage — problem, product, how-it-works, case study, FAQ, CTA |
| `03-pricing.png` | Pricing page — two-tier cards, feature comparison table, onboarding timeline, FAQ |
| `04-showcase.png` | Showcase page — theme previews and full page-by-page product walkthrough |
| `04b-showcase-conversation.png` | Showcase page — the two auto-playing chat conversation simulations, mid-playback |
| `05-book.png` | Multi-step lead-capture form, step 1 of 3 |
| `06-mobile-home.png` | Mobile viewport (390px) — responsive homepage hero |

*Screenshots were captured against a local dev instance of the live codebase.*
