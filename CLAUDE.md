# Diehan Drotschie — CV / Portfolio Site

Personal CV/portfolio for Diehan Drotschie, a software developer at Games Global
(South Africa). Deployed to GitHub Pages at `https://diehandrotschie.github.io/DiehanCV`.

> **Standing instruction from the user: keep this file up to date.** Any time you
> make a non-trivial change in this repo (new feature, structural change, a bug you
> had to work around, a decision with a reason behind it), update the relevant
> section below in the same session — don't leave it for later. This file is what
> lets the next session (yours or another agent's) pick up without re-deriving
> context from scratch.

## Current state (branch: `feature/astro-refactor`)

This is a **from-scratch refactor** of a previous React + MUI site into a static
Astro site styled as a macOS desktop (menu bar, dock, draggable windows, Spotlight
search). The old React site's content was fully preserved before the rewrite — see
[CONTENT.md](CONTENT.md) for the canonical content dump (every section's text, all
image references, deploy notes) captured before any code changed.

### Why it looks like this
The user asked for the visual/interaction style of the Astro theme
[macos-portfolio-extended](https://astro.build/themes/details/macos-portfolio-extended/)
(repo: `aabdoo23/portfolio`) — **as design inspiration only, not a clone**. That repo
was evaluated and rejected for direct cloning because:
- It's a full-stack app (Supabase DB, Groq AI chat, admin dashboard, Vercel serverless
  functions), not a static site — total mismatch with "lightweight, just show my CV"
  and with GitHub Pages hosting.
- Its README claims MIT license but the repo has **no actual LICENSE file**
  (`license: null` via GitHub API) — informal claim, not a verified grant.
- Collects visitor PII (IP, user agent, time-on-page) via its contact form.

So: **no code or assets were copied from that repo.** Everything here (window
manager JS, wallpaper SVG, icon tiles, CSS) was built from scratch to *look* like
that theme's live demo (dark macOS desktop, frosted glass windows, colorful dock
icons, Spotlight search) without any of its backend complexity.

First implementation pass only got the *interaction model* right (windows/dock/
spotlight) but kept the old site's cream/teal palette and plain outline icons —
looked like "React site wearing a window manager." Second pass fixed this: dark
night-sky wallpaper (original SVG art, not Apple's actual wallpaper — avoids any IP
issue while still giving a photographic desktop feel), dark translucent menu bar
with a keyboard-shortcut hint row, colorful gradient squircle dock icons, glossy 3D
traffic lights, dark frosted Spotlight overlay.

Third pass: unified mobile and desktop into **one responsive shell** instead of two
separate DOM trees (see "Mobile / responsive behavior" below) — the user wanted
mobile to keep the same desktop aesthetic (wallpaper, dock, windows), just with the
dock relocated to a vertical rail on the right instead of a plain light stacked
fallback page.

## Stack

- **Astro** (static output, no SSR/backend) — `astro.config.mjs` sets
  `site: https://diehandrotschie.github.io` and `base: /DiehanCV/` (trailing slash
  matters — without it, `import.meta.env.BASE_URL` produces malformed asset paths
  like `/DiehanCVDiehanCV.pdf`; this bit us once already, don't remove it)
- No UI framework (no React/MUI) — plain Astro components + vanilla TypeScript
  `<script>` blocks for interactivity
- Deployed via `.github/workflows/pages.yml` (GitHub Actions → GitHub Pages). Astro 7
  requires **Node ≥22.12**, so CI is pinned to Node 22 — don't drop this back to 20.
- Also has a manual `npm run deploy` (gh-pages package) as a fallback deploy path

## Structure

```
src/
  data/
    site.js        # all CV content: hero, about, skills, projects, experience,
                    # achievements, academics, contact — single source of truth
    apps.js         # desktop "app" registry: id, title, icon (inline SVG string),
                    # gradient (dock tile color), window width/height, openOnLoad
  components/
    apps/            # content of each window — About/Skills/Work/Experience/
                      # Achievements/Resume/Contact — pure content, no window chrome
    desktop/          # the macOS shell: Wallpaper, MenuBar, Dock, Spotlight,
                       # WindowFrame (chrome wrapper), DesktopScript (window manager)
  layouts/Layout.astro
  styles/
    global.css        # base tokens/utility classes used inside window/app content
    desktop.css        # the macOS shell itself (menu bar, dock, windows, spotlight)
                        # — includes the `@media (max-width: 900px), (pointer: coarse)`
                        # block that reflows the shell for mobile (see below)
  pages/index.astro     # assembles everything; maps apps.js entries to app components
public/
  Photos/               # all project screenshots + profile photo — do not lose these
  DiehanCV.pdf           # downloadable CV
```

There is no separate `Footer.astro` / `MobileView.astro` anymore — both were removed
when mobile was merged into the single desktop shell (see below). If you're looking
for a copyright line, it lives in `MenuBar.astro`'s `.hint-row` (hidden on mobile
purely for space — the row itself, hints and all, doesn't fit a phone-width menu bar).

### How the window system works
`DesktopScript.astro` is vanilla JS (no framework): tracks a z-index counter, opens/
closes/focuses/drags `.window` elements by id, matching `data-open` attributes on
dock buttons, menu bar items, and Spotlight results. Content for each "app" lives in
`src/components/apps/*.astro` and is rendered **once** per app id via a component map
in `index.astro` (no duplication between desktop/mobile — see below). Adding a new
app = add an entry to `apps.js` (id, title, icon SVG, dock gradient, window
width/height, `openOnLoad`), create `apps/XApp.astro`, add it to the
`appComponents` map in `index.astro`.

### Mobile / responsive behavior
One shell, not two. There used to be a separate `MobileView.astro` that duplicated
all app content into a plain light stacked page under 900px width — the user
explicitly asked for mobile to keep the *same macOS desktop aesthetic* instead (same
wallpaper, same windows, same dark chrome), just with the dock moved to a vertical
rail on the right edge instead of the bottom-center bar. That fallback page and its
duplication were removed; `.desktop` now renders unconditionally for all
viewports/devices.

What actually changes on mobile (all via the same `@media (max-width: 900px),
(pointer: coarse)` query used both in `desktop.css` and mirrored as `MOBILE_QUERY`
in `DesktopScript.astro`):
- **Dock**: `flex-direction` flips to vertical, repositioned to `right: 10px`,
  vertically centered, icons shrink slightly, hover-tooltip flips to the left side of
  the icon instead of above it.
- **Menu bar**: the per-app text buttons and the `.hint-row` (keyboard-shortcut
  hints + copyright) are hidden — no room for them at phone width. Brand, search
  trigger, and clock stay.
- **Windows**: `DesktopScript.astro`'s `isMobile()` check branches window sizing.
  On mobile, `openWindow()` (a) closes every other open window first — **only one
  window open at a time** on mobile, to avoid overlapping clutter — and (b) sizes
  the window near-fullscreen via `sizeForMobile()` (fixed inset, not the
  desktop's centered/staggered `sizeForDesktop()`). A `resize` listener re-applies
  the correct sizing function to whatever window is open if the viewport crosses the
  breakpoint (e.g. orientation change).
- **Dragging**: the titlebar `mousedown` drag-start handler checks `isMobile()` and
  bails out — windows aren't draggable on mobile (also moot in practice since touch
  doesn't fire continuous `mousemove`, but the explicit guard keeps intent clear).

If you change the breakpoint or the query, update it in **both** places — CSS media
query in `desktop.css` and `MOBILE_QUERY` in `DesktopScript.astro` — they must stay
in sync since one controls layout and the other controls window-sizing/behavior
logic, and there's no shared source for the breakpoint value.

## Conventions / gotchas learned this session

- **Don't hand-edit content in components.** All copy lives in `src/data/site.js`.
  If content needs to change, update there (and update `CONTENT.md` too, since it's
  meant to stay the canonical backup).
- **Screenshot tool in this environment can get stuck showing a stale/blank frame**
  after scrolling or repeated calls in the same tab. When that happens, verify via
  `get_page_text` / `read_page` / direct JS (`document.querySelector` /
  `getBoundingClientRect` / `.click()`) instead of fighting the screenshot tool, or
  open a fresh tab.
- The gallery lightbox in `WorkApp.astro` uses `root.querySelector` scoped to
  `.work-app` (not global `getElementById`). This was originally defensive because
  an earlier version rendered the component twice (desktop + a separate mobile
  view); that duplication is gone now, but the scoped-query pattern was left as-is
  since it's harmless and still correct — no need to "fix" it back to global ids.
- Traffic-light window buttons: only the red (close) one is currently functional;
  yellow/green are decorative. If asked to add minimize/maximize, that's net-new
  work, not a bug.

## Open items / things the user may still ask for
- Chatbot (AI terminal like the reference theme has) — explicitly deferred by the
  user as a "maybe later" feature. Do not add Groq/Supabase/any backend for it
  without the user asking again; it changes hosting requirements (would need to
  move off pure static GitHub Pages).
- Wallpaper/icon styling is intentionally original artwork, not sourced from the
  reference theme or Apple — keep it that way if iterating further.
- Mobile windows currently force near-fullscreen height (`sizeForMobile()`) even for
  short-content apps like Contact, leaving visible empty space below the content.
  Not fixed yet — would need either sizing-to-content on mobile or a deliberate
  design call from the user on whether that empty space is fine.
