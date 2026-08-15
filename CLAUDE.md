# Diehan Drotschie — CV / Portfolio Site

Personal CV/portfolio for Diehan Drotschie, a software developer at Games Global
(South Africa). Deployed to GitHub Pages at `https://diehandrotschie.github.io/DiehanCV`.

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
    MobileView.astro  # non-desktop fallback: same app content stacked as a plain
                       # scrolling page, shown instead of .desktop under 900px width
                       # or on touch devices (dragging windows doesn't work on phones)
    Footer.astro
  layouts/Layout.astro
  styles/
    global.css        # base tokens/utility classes shared by both desktop + mobile
    desktop.css        # macOS-shell-specific styles (menu bar, dock, windows, spotlight)
  pages/index.astro     # assembles everything; maps apps.js entries to app components
public/
  Photos/               # all project screenshots + profile photo — do not lose these
  DiehanCV.pdf           # downloadable CV
```

### How the window system works
`DesktopScript.astro` is vanilla JS (no framework): tracks a z-index counter, opens/
closes/focuses/drags `.window` elements by id, matching `data-open` attributes on
dock buttons, menu bar items, and Spotlight results. Content for each "app" lives in
`src/components/apps/*.astro` and is rendered once per app id via a component map in
`index.astro`. Adding a new app = add an entry to `apps.js`, create `apps/XApp.astro`,
add it to the `appComponents` map in `index.astro`.

`MobileView.astro` renders the **same** app components again, just stacked in
`<section>` blocks instead of floating windows — this is deliberate content
duplication (both live in the static HTML output, CSS media query picks which is
visible) rather than DOM relocation, since it's simpler/more robust for a CV site
where the text content is small. Don't "optimize" this into a single shared DOM tree
without checking why it was done this way.

## Conventions / gotchas learned this session

- **Don't hand-edit content in components.** All copy lives in `src/data/site.js`.
  If content needs to change, update there (and update `CONTENT.md` too, since it's
  meant to stay the canonical backup).
- **Screenshot tool in this environment can get stuck showing a stale/blank frame**
  after scrolling or repeated calls in the same tab. When that happens, verify via
  `get_page_text` / `read_page` / direct JS (`document.querySelector` /
  `getBoundingClientRect` / `.click()`) instead of fighting the screenshot tool, or
  open a fresh tab.
- The gallery lightbox in `WorkApp.astro` uses `root.querySelector` scoped to each
  `.work-app` instance (not global `getElementById`) because the same component
  renders twice (desktop window + mobile stacked view) — don't refactor it to use
  global ids, that would break one of the two instances.
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
