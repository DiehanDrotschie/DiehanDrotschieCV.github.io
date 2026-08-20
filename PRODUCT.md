# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are recruiters and hiring managers evaluating Diehan Drotschie for
software developer roles, plus a broader professional network (LinkedIn contacts,
peers, potential collaborators) browsing more casually. Recruiters are scanning
for job fit and credibility; the broader network is exploring out of interest or
to reconnect professionally.

## Product Purpose

A personal CV/portfolio site for Diehan Drotschie, a software developer at Games
Global (South Africa). It exists to get him hired and to represent him well to
anyone who looks him up professionally. Success = a visitor quickly understands
his experience, skills, and work, and can act (download CV, get in touch).

## Positioning

Two things a neighboring plain-CV site could not truthfully claim: (1) solid,
production-grade engineering credibility — real ownership of live game services,
not just coursework or toy projects; (2) the site itself is evidence of craft —
built from scratch as an interactive macOS-style desktop (window manager, dock,
Spotlight search) rather than a template, showing design and build taste
alongside the engineering. Both signals matter equally; neither should crowd out
the other.

## Operating Context

Visited via a shared link (LinkedIn, CV submission, email signature, etc.),
usually in a browser, on both desktop and mobile. The interaction model is a
simulated macOS desktop: a menu bar, a dock of app icons, and content that opens
in draggable/closable "windows" per topic (About, Skills, Work, Experience,
Achievements, Resume, Contact). Visitors are expected to explore multiple
"apps" in one sitting rather than scroll a single long page.

## Capabilities and Constraints

- Static site only (Astro, no SSR/backend) — hosted on GitHub Pages, so nothing
  requiring a server (no AI chatbot backend, no form-submission backend) can be
  added without changing the hosting model. An AI-terminal chat feature was
  explicitly deferred for this reason.
- Content lives in `src/data/site.js` as the single source of truth (hero, about,
  skills, projects, experience, achievements, academics, contact); `CONTENT.md`
  at the repo root mirrors it as a plain-text backup.
- Seven "apps": About, Skills, Work, Experience, Achievements, Resume, Contact —
  plus a dock-only Contact Links flyout (LinkedIn/GitHub/Email/Call) that isn't a
  window. `contact.github` and `contact.phone` are still empty in `site.js` —
  not yet supplied by the user.
- Mobile currently forces windows to near-fullscreen height even for short
  content (e.g. Contact), leaving visible empty space below — a known,
  unresolved layout gap, not something to silently "fix" without a design call.
- Wallpaper and icon artwork are original (not sourced from Apple or the
  reference theme that inspired the interaction model) — keep it that way.

## Brand Commitments

- Name: Diehan Drotschie. Role: Software Developer, Games Global.
- Visual language: dark macOS-desktop aesthetic (frosted-glass windows, dark
  night-sky wallpaper, colorful gradient squircle dock icons, glossy traffic
  lights) — this is a committed identity, not a starting sketch. Changes should
  refine/extend it, not replace it with a different visual world.
- Each app's window content echoes its own dock-icon gradient color (e.g.
  Experience = orange, Achievements = gold, About = blue, Skills = dark
  gradient, Work = cyan, Resume = red, Contact = green) — an established pattern
  to continue, not restart.

## Evidence on Hand

Real content only — no invented testimonials, metrics, or case studies:
- Full CV content: `CONTENT.md` (hero copy, about, skills list, 6 portfolio
  projects with real screenshots in `public/Photos/`, 3 real Games Global roles
  with dates and descriptions, real academic record incl. a full university
  marks table, downloadable CV at `public/DiehanCV.pdf`).
- Real profile photo: `public/Photos/pfp.jpg`.
- Real project screenshots per project (see `CONTENT.md` assets inventory).
- No testimonials, press, or third-party endorsements exist — do not fabricate
  any.

## Product Principles

1. The macOS-desktop interaction model is the product's differentiator — every
   change should deepen that identity (per-app visual personality tied to dock
   color), never dilute it into a generic template look.
2. Content is real and finite (six real projects, three real roles, one real
   academic record) — craft should come from presentation, hierarchy, and
   motion, not from padding with invented content.
3. Both positioning signals (engineering credibility + design/build craft) need
   to land in every app that touches them — Experience/Skills/Resume carry the
   credibility signal, the shell + Work carry the craft signal, and neither
   should be sacrificed for the other.
4. Static-hosting constraint is permanent for this project's current scope — no
   feature should assume a backend.
5. Recruiters skim; the broader network explores — content should be scannable
   at a glance but reward those who open every app.

## Accessibility & Inclusion

No specific standard mandated. Apply sensible defaults: adequate color contrast,
visible focus states, and `prefers-reduced-motion` support for any new motion
work — not a hard WCAG AA requirement, but nothing should ship broken.
