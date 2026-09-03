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
traffic lights, dark frosted Spotlight overlay. **Superseded 2026-08-18** — the
night-sky SVG wallpaper was replaced by an actual photo; see "Wallpaper: Bliss-style
photo" below.

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
- **Traffic-light window buttons are all functional now (2026-08-17)**: red
  closes, yellow minimizes (shrinks toward its dock icon, `minimize-out`/`-in`
  keyframes in `desktop.css`, driven by `minimizeWindow`/`restoreMinimized` in
  `DesktopScript.astro`), green maximizes/restores (`maximizeWindow`, fills the
  desktop area below the menu bar). Double-clicking the titlebar also maximizes.
  Windows are also resizable from any edge/corner via the 8 `.resize-handle`
  elements added in `WindowFrame.astro` — desktop-pointer only, hidden and
  disabled on mobile (`isMobile()` guards + `display:none` in the mobile media
  query), min size 320×220. Dragging or resizing a maximized window un-maximizes
  it first, matching real macOS behavior.
  **Gotcha if you touch this again**: minimize/restore originally completed the
  state change (`display:none`, class cleanup) only inside an `animationend`
  listener. That silently breaks under `prefers-reduced-motion` (which sets
  `animation: none`, so the event never fires) and also never fired in this
  sandboxed Browser pane during testing (same root cause as the existing
  transition-verification gotcha above — no compositor ticks). Fixed via
  `onAnimationSettled()`, which races `animationend` against a `setTimeout`
  fallback. Don't reintroduce a bare `animationend`-only completion for any
  future window-state animation — always pair it with a timeout fallback.
- The viewport `resize` listener used to only resize `document.querySelector(".window.open")`
  (first match only) on every resize, which would have mis-sized every open
  window but the first once more than one could be open simultaneously. Now it
  only reflows windows when crossing the mobile/desktop breakpoint (reflowing
  *all* open windows at that point), and otherwise only re-fits windows that are
  currently maximized — a manually-resized window's size is left alone on a
  plain viewport resize, since fighting a size the visitor chose would be worse
  than leaving it.

## Per-app visual identity (started 2026-08-17)

The user wants each dock app's window content to look distinct/interesting instead
of all being plain text lists — asked for 1-2 apps done first as a pattern to build
off, rather than a spec for all of them upfront.

**Established pattern**: each app's content styling echoes that app's own dock
gradient color (defined in `apps.js`) via a scoped `<style>` block in its
`*App.astro` file — so the app "feels" like its icon instead of every window
looking like the same frosted-glass text box. Two apps done so far:

- **ExperienceApp.astro**: vertical timeline — gradient dot + connecting line per
  role (orange, matching the Experience dock icon), period shown as a pill/chip,
  the most recent role's `extra` field rendered as a highlighted "Latest milestone"
  callout box instead of a plain trailing paragraph.
- **AchievementsApp.astro**: category cards (Academic/Culture/Sports) got a small
  gradient icon badge (gold, matching the Achievements dock icon) in the header and
  bullet-dot list items instead of plain `- text` lines; the university marks table
  got color-coded pill badges per mark (gold ≥90 with a ★, teal 80-89, blue 70-79,
  grey <70) instead of plain numbers. The ≥90 tier was originally a flat mustard
  yellow — user asked for something more "gold" specifically, so it's now a
  metallic gold gradient badge (cream→gold→bronze, dark brown text, inset
  highlight) with a star glyph, not just a darker yellow.
- **AboutApp.astro**: photo got a gradient ring frame (blue, matching the About
  dock icon), tags recolored blue, the `<hr>` divider became a fading gradient
  line, and the facts grid (Nationality/Age/Sex) became icon-badge cards instead
  of plain label/value pairs.
- **SkillsApp.astro** ("could go further" — done): the flat chip list is now
  grouped into three sections (Languages / Frameworks & Tools / Cloud) via a
  keyword-based partition of the same `skills` array in `site.js` (no data
  changes), each skill rendered as a tile with a 2-letter glyph badge in the dark
  gradient matching the Skills dock icon.
- **WorkApp.astro**: project cards got a cyan top accent bar (matching the
  Portfolio dock icon) and the "N images" caption became a small floating badge
  on the thumbnail instead of a text line — gallery/lightbox behavior unchanged.
- **ResumeApp.astro**: header now has an icon badge + subtext, the download
  button and the iframe's border frame both use the red gradient matching the
  Resume dock icon.
- **ContactApp.astro / split into two, 2026-08-17**: the window now shows just
  the heading/subtext and a single "Email Me" CTA (green, matching its dock
  icon). The LinkedIn/Email row-links that used to live here moved out into a
  **new dock-only item, `contact-links`** (see below) — the window no longer
  needs to carry every channel since the dock icon does that job now.

### Contact Links dock flyout (added 2026-08-17)

New `apps.js` entry `{ id: "contact-links", links: true, ... }` — a dock icon
that is **not a window**. `apps.js`'s `links: true` flag is a general escape
hatch for "dock icon with no window"; `index.astro`, `Spotlight.astro`, and
`DesktopScript.astro`'s `appMeta` all filter out `app.links` entries so nothing
tries to open/search for a nonexistent window.

`Dock.astro` special-cases `app.links` entries: instead of the normal button, it
renders a `.dock-item-links` wrapper containing a `.dock-trigger` button (the
icon) and a `.dock-flyout` popover listing LinkedIn / GitHub / Email / Call,
built from `contact.linkedin` / `contact.github` / `contact.email` /
`contact.phone` in `site.js` — **entries with an empty value are filtered out
automatically**, so the flyout only ever shows links that actually exist.

**`contact.github` and `contact.phone` are currently empty strings in
`site.js` — the user still needs to supply their actual GitHub profile URL and
phone number.** Once filled in, GitHub and Call will appear in the flyout with
no other code changes needed.

The flyout opens two ways, both wired in `DesktopScript.astro`:
- **Hover / focus** (desktop, keyboard) via pure CSS (`:hover`/`:focus-within`
  in `desktop.css`).
- **Click/tap** toggles a `.open` class (same CSS rule also keys off `.open`) —
  this exists specifically so it also works on **touch**, since touch devices
  have no hover state at all (same limitation already noted for the dock
  tooltips). A document-level click listener closes it when clicking outside,
  and Escape closes it alongside Spotlight.

On mobile the flyout repositions to open to the *left* of the dock's vertical
rail instead of *above* it, mirroring how the existing dock-label tooltip
already flips sides in the `@media (max-width: 900px), (pointer: coarse)`
block — kept in sync in the same media query in `desktop.css`.

**A note on verifying this in this environment**: when testing the hover/open
state via the Browser pane tooling here, `getComputedStyle().opacity` can read
back as stuck at the transition's *start* value indefinitely even though the
matching CSS rule is 100% correctly applied (confirmed via `element.matches()`
and direct stylesheet inspection) — `element.getAnimations()` shows the
transition frozen at `currentTime: 0`. This happens because the Browser pane
tab isn't actively compositing frames in this sandboxed environment (the same
underlying cause as the screenshot tool getting stuck, see the existing gotcha
above) — CSS transitions need paint ticks to advance, and this tab wasn't
getting them. `pointer-events` (not animatable, applies as a discrete flip)
*did* update correctly, which is what proved the rule was applying. If this
happens again: check `pointer-events` or another non-animated property in the
same rule instead of trusting `opacity`/`transform` reads for verification, or
just trust static CSSOM/selector analysis over live computed-style reads for
transition-based show/hide effects here.

**Still plain / candidates for the same treatment**: none of the seven window
apps remain untouched now — if asked to keep iterating, look for a next layer
(e.g. micro-interactions/animations on open, richer Work gallery captions,
Spotlight result styling) rather than a first pass on an app.

## Impeccable design skill (adopted 2026-08-17)

The repo now uses the `impeccable` design skill (see `~/.claude/skills/impeccable`)
for design work. `PRODUCT.md` at the repo root was written via `/impeccable init` —
it's the durable product-truth record (users, positioning, constraints, brand
commitments) that skill reads before doing design work; keep it in sync the same
way as this file when product facts change. There is no `DESIGN.md` yet (no
`/impeccable document` run) — the incumbent code/CSS is still treated as the
design authority per the skill's rules.

**Craft-floor pass across all seven apps (2026-08-17)**: applied the skill's
"refuse" list (no eyebrows/kickers, no colored `border-left` callouts, no same-size
icon+heading+list card repetition) plus typography/motion/browser-surface craft on
top of the per-app identity pass above:
- **Typography**: self-hosted `@fontsource-variable/outfit` (installed via npm, no
  Google Fonts `<link>`) now drives all headings/display text via `--font-display`
  in `global.css`, imported once in `Layout.astro`. Body copy stays on the
  `system-ui` stack (`--font-body`) for contrast between display and body voice —
  don't add a second webfont without a reason, one display face is the point.
- **Eyebrow removed**: `AboutApp.astro`'s old `.eyebrow` label above the headline
  (a banned pattern per the skill's craft floor) became a name heading
  ("Diehan Drotschie", not shown anywhere before this) + a `.role-pill` badge
  ("Software Developer") next to it. The `.eyebrow` utility class was deleted from
  `global.css` since nothing else used it — don't re-add a kicker/eyebrow pattern.
- **Colored border-left removed**: `ExperienceApp.astro`'s "Latest milestone"
  callout had a `border-left: 3px solid` (a banned "side-tab" pattern, also flagged
  by `node .claude/skills/impeccable/scripts/detect.mjs`) — now a full 1px border
  plus a small icon badge instead.
- **Achievements restructured**: was three identical icon+heading+list cards
  (Academic/Culture/Sports side by side) — the detector-adjacent "same-size card
  repetition" pattern. Now Academic is a wider hero card (`.trophy-hero`, `1.3fr`)
  featuring the real 94.57% average as a large stat, and Culture+Sports share one
  narrower card as two sections split by a divider instead of two separate cards.
  Collapses to one column under 640px.
- **Work portfolio grid**: the project with the most images (currently Instagram
  Clone, computed via `projects.reduce` in `WorkApp.astro` — not hardcoded, so it
  re-picks automatically if `site.js` changes) now spans both grid columns as a
  featured card. The cyan `::before` top accent bar (flagged by the detector as a
  "side-tab" slop pattern) was removed in favor of a tinted border that
  brightens on hover; gallery lightbox restyled from flat black to the same dark
  frosted-glass treatment used elsewhere (Spotlight, dock flyout) instead of being
  visually disconnected from the rest of the shell.
- **Motion**: windows now play a single 320ms scale/blur/fade-in
  (`@keyframes window-in` in `desktop.css`) on open — the one authored motion
  moment for the whole shell, respecting `prefers-reduced-motion`. Don't add
  per-app entrance animations on top of this; it's deliberately one moment, not
  scattered effects.
- **Browser surfaces**: themed `::selection`, `:focus-visible` rings, and a thin
  custom scrollbar on `.window-body` (global.css / desktop.css) — previously all
  browser defaults, which the skill flags as the cheapest tell that a page wasn't
  fully designed.
- **Tabular numerals**: `font-variant-numeric: tabular-nums` added to `table` in
  `global.css` (inherited into the marks-table badges) and the menu bar clock.

Ran `node .claude/skills/impeccable/scripts/detect.mjs --json <path>` after this
pass — the only remaining finding is a `broken-image` warning on `WorkApp.astro`'s
`<img class="gallery-image" src="">`, which is an intentional empty placeholder
the lightbox script fills in on open, not a real bug.

## Creative pass — bolder per-app motion/layout (2026-08-17)

After the craft-floor pass above, the user explicitly asked to go further: "allowed
to completely change the layout and add animations... make it pop out more" plus
"more unique and creative", and separately asked for full window resize/minimize/
maximize. Distinct from the craft-floor pass (which was conservative/refinement-only),
this round leaned into signature interactions per app:

- **AboutApp.astro**: the photo frame now does a live mouse-tilt (3D `perspective`/
  `rotateX`/`rotateY` driven by pointer position, scoped `<script>` at the bottom of
  the file) instead of being static — reset on `mouseleave`, skipped entirely under
  `prefers-reduced-motion`.
- **SkillsApp.astro**: tiles within a group now sit at a staggered rhythm
  (`--stagger` CSS var, `i % 3 * 6px`) instead of a flat single-baseline row, glyphs
  are circular and rotate slightly on tile hover, group titles got a colored
  `.skill-group-rule` gradient line instead of sitting bare.
- **ExperienceApp.astro**: the connecting line between timeline dots now "draws
  itself" in on window open (`scaleY` keyframe, staggered per item via
  `--line-delay`), and whichever role's period contains "Present" gets a pulsing
  ring on its dot (`.timeline-dot-current`) — driven by the real data, not a
  hardcoded index, so it moves automatically if a new role is added later.
- **WorkApp.astro**: project cards do the same mouse-tilt as the About photo
  (separate copy of the same technique in the card's own script block, not a
  shared util — there's no shared JS module in this project yet, and duplicating
  ~10 lines twice didn't justify introducing one).
- **AchievementsApp.astro**: the 94.57% stat now counts up from 0 the first time
  it scrolls into view (`IntersectionObserver` + `requestAnimationFrame`, real
  value stored in `data-count-to`/`data-suffix`, not re-typed in the animation).
  **Robustness note**: the count-up settle step has a `setTimeout` fallback
  alongside the `rAF` loop — don't remove it. rAF/IntersectionObserver can stall
  indefinitely (throttled/backgrounded tabs; this was actually observed while
  testing in this sandboxed Browser pane, which never ticks compositor frames at
  all — see the existing transition-verification gotcha above) and without the
  fallback the real number would stay stuck at "0%" for that visitor.
- **ResumeApp.astro**: `.resume-frame-wrap` grew two rotated `::before`/`::after`
  pseudo-elements behind it — a small fanned "stack of pages" look instead of a
  single flat sheet. Icon and download button got spring-style hover lifts.
- **ContactApp.astro**: the email CTA got a soft pulsing radial-gradient glow
  behind it (`.contact-cta-glow`, `cta-pulse` keyframe) — an invitation cue, not
  just a static button.
- **Shared hover language**: dock icons, project/skill/fact cards etc. all use
  `cubic-bezier(0.16, 1, 0.3, 1)` (smooth ease-out-expo, same curve as the
  window-open animation) for their lift/scale transitions — **not** an overshoot
  "spring" curve like `cubic-bezier(0.34, 1.56, 0.64, 1)`. That was tried first and
  reverted: `node .claude/skills/impeccable/scripts/detect.mjs` flags overshoot/
  elastic easing as a `bounce-easing` slop pattern ("feel dated and tacky"). Don't
  reintroduce bounce/elastic easing on hover/entrance transitions in this repo.

## Window manager — resize, minimize, maximize (2026-08-17)

All three traffic-light dots are now functional (previously only close worked —
see the old gotcha this replaced). Everything lives in `DesktopScript.astro` +
`desktop.css` + the 8 `.resize-handle` elements added to `WindowFrame.astro`:

- **Resize**: drag any of the 8 edge/corner handles (desktop-pointer only, hidden
  via `display:none` in the mobile media query, min size 320×220). The handler is
  generic — one function keyed by a `data-edge` string like `"se"`/`"n"`/`"w"` —
  not eight copy-pasted handlers.
- **Minimize** (yellow): shrinks toward its dock icon and hides
  (`minimizeWindow`/`restoreMinimized`, `minimize-out`/`minimize-in` keyframes).
  Clicking the dock icon again restores it from wherever it was left, rather than
  re-opening fresh.
- **Maximize** (green): toggles between custom bounds and filling the desktop area
  below the menu bar (`maximizeWindow`, `getDesktopBounds()`). Double-clicking the
  titlebar does the same thing. Dragging or resizing a maximized window
  un-maximizes it first (matches real macOS) — see the `maximizedIds.has(id)`
  checks in the drag/resize mousemove handlers.
- **Gotcha if you touch this again**: state-completing logic (minimize/restore)
  originally lived only inside an `animationend` listener. That's fragile —
  `prefers-reduced-motion` sets `animation: none` so the event never fires, and it
  also never fired in this sandboxed Browser pane during testing (confirmed via a
  direct test: `requestAnimationFrame` never ticks here either — the pane never
  composites a frame, a stronger version of the existing transition-verification
  gotcha above). Fixed with `onAnimationSettled()`, which races `animationend`
  against a `setTimeout` fallback. Any future window-state animation should use
  this helper (or the same race pattern) instead of a bare `animationend` listener.
- The viewport `resize` listener used to resize only
  `document.querySelector(".window.open")` (first match only) on every resize —
  wrong once more than one window could be open. Now it only reflows *all* open
  windows when the mobile/desktop breakpoint is actually crossed, and otherwise
  only re-fits windows that are currently maximized; a manually-resized window's
  size is left alone on a plain viewport resize.

## Scroll-reveal system (added 2026-08-18)

User asked to go through every app with the `ui-ux-pro-max` design skill and add
"more life to it as you scroll through it." Added a shared scroll-reveal primitive
used across all seven window apps instead of a bespoke animation per app:

- **CSS** (`global.css`): `.reveal` (opacity-only fade) and `.reveal-rise`
  (opacity + `translateY(18px)→none`) utility classes, toggled by a JS-added
  `.is-visible` class, both with a `--reveal-delay` custom property for stagger
  and a `prefers-reduced-motion` override that forces them fully visible with no
  transition. `.reveal` (opacity-only) exists specifically for elements that
  already own their resting `transform` — e.g. `SkillsApp.astro`'s `.skill-tile`
  uses `transform: translateY(var(--stagger))` for its baseline stagger offset;
  a reveal rule that also touched `transform` would win on `.is-visible` and
  wipe that positioning out. Everything else uses `.reveal-rise`.
- **JS** (`DesktopScript.astro`): a `revealVisible()` helper (paired `isInView()`
  check) that adds `.is-visible` to any un-revealed `.reveal`/`.reveal-rise`
  element whose `getBoundingClientRect()` overlaps both the viewport and its
  closest `.window-body` ancestor's clip rect (so content scrolled out of a
  window's own visible area isn't counted as "in view" just because its raw
  coordinates happen to overlap the browser viewport).
  **Gotcha if you touch this**: this is deliberately plain `scroll`/`resize`
  listeners + direct calls, **not an `IntersectionObserver`**. IO was tried
  first and reverted — confirmed via direct test that in this sandboxed Browser
  pane, elements sat at `opacity: 0` forever despite being squarely inside the
  viewport, because the pane never composites a frame (same root cause as the
  existing `animationend`/`requestAnimationFrame` gotchas elsewhere in this
  file). `revealVisible()` is called directly from `openWindow()`,
  `restoreMinimized()`, and `maximizeWindow()` (none of those fire a `scroll`
  event on their own but can bring new content into view), plus wired to every
  `.window-body`'s `scroll` event and the window's `resize` event. Don't
  reintroduce IntersectionObserver for this without also keeping a manual
  fallback — it's unverifiable in this environment and the existing project
  convention (count-up stat, minimize/restore) already treats compositor/rAF-
  driven callbacks as unreliable enough to need a non-rAF fallback.
- **Applied per app**: `AboutApp` (hero block, Summary heading/paragraph, fact
  cards staggered), `SkillsApp` (each group heading + tile, tiles staggered
  45ms apart), `WorkApp` (project cards staggered 70ms apart), `ExperienceApp`
  (each timeline entry's content block staggered 90ms apart, independent of the
  existing line-draw/pulse animations which stay tied to window-open, not
  scroll), `AchievementsApp` (the academic hero card, the culture/sports card,
  and the university-education card, staggered), `ResumeApp` (header, then the
  framed PDF preview), `ContactApp` (hero, CTA, and the dock-flyout hint,
  staggered). Verified via direct JS in the Browser pane (dispatching a
  synthetic `scroll` event on each `.window-body` and checking `.is-visible`
  counts before/after) rather than screenshots, since this pane doesn't
  composite frames — see the existing screenshot-tool gotcha above.

## Wallpaper: Bliss-style photo (2026-08-18)

User asked to swap the desktop background for something like the Windows XP
"Bliss" wallpaper. The real Bliss photo is a licensed Getty Images stock photo
(Charles O'Rear) — not free to use — so instead of that exact image, a free-license
lookalike was sourced from Unsplash and downloaded to
`public/Photos/wallpaper-hills.jpg` (2400×1600, ~800KB):

- **"Rolling green hills under a blue sky with clouds"** by Bell C.
  (`@bchen22`), shot in Washington, USA, published 2025-08-24.
  Source: https://unsplash.com/photos/x9YqzbKd8hU
  License: [Unsplash License](https://unsplash.com/license) — free for commercial
  and non-commercial use, no permission required, attribution appreciated but not
  required. If this ever needs re-sourcing, that's the license standard to match.

`Wallpaper.astro` went from a hand-drawn dark night-sky SVG to `<img
src=".../Photos/wallpaper-hills.jpg">` with `object-fit: cover`, plus a subtle
top/bottom-only `linear-gradient` scrim (not a full-image dim) so the menu bar and
dock text stay legible against whatever part of the photo sits behind them. The
menu bar/dock/window frosted-glass styling (`rgba(10-20, ..., 0.35-0.55)` +
`backdrop-filter: blur`) needed **no changes** — dark vibrancy panels are designed
to read on top of any wallpaper, bright or dark, which is why this was a
drop-in background swap rather than a full shell restyle. `.desktop`'s fallback
background color (`#0b1a2e`, shown briefly before the photo loads) was left as-is.

## Dock icon redesign (2026-08-18)

User asked for "Apple/Mac specific icons instead of these" (the previous abstract
outline glyphs). Actually reproducing Apple's real app icons (Finder, Mail, Photos,
etc.) wasn't done — those are Apple's trademarked/copyrighted designs, the same
"don't source from the real thing" boundary this repo already holds for the
wallpaper/theme (see the top of this file). Instead, `src/data/apps.js`'s icon
glyphs were redrawn as original artwork that **evokes** a specific kind of macOS
app per window, so the dock reads as more authentically "Mac-like" without any
trademark risk:

- **About** → Contacts-style ID card (rounded card, portrait circle, shoulders)
- **Skills** → Terminal-style window (chevron prompt + cursor line)
- **Portfolio** → Photos-style frame (sun + mountain skyline)
- **Experience** → Calendar-style grid (binder rings + date dots)
- **Achievements** → Game Center-style medal (rosette + star)
- **Resume** → Pages-style document (folded corner + text lines)
- **Contact** → Mail-style envelope (unchanged, already fit)
- **Contact Links** (dock flyout trigger) → address-book style (spine tabs +
  entry lines)

All icons are still generated through the same `icon(paths, viewBox)` helper at
the top of `apps.js` and rendered via `Dock.astro`/`Spotlight.astro`, which read
`app.icon` directly — no changes needed there. If you touch these again, keep new
glyphs in this "generic app-genre" register (terminal, calendar, contacts card,
photo frame, medal, document, envelope, address book) rather than tracing any
specific real Apple icon.

## Wallpaper fill fix + Liquid Glass shell restyle (2026-08-18)

**Fill bug**: user reported a visible flat-color gap below the wallpaper photo
on their screen. Root cause: `.desktop` was `position: fixed; inset: 0;` with no
explicit size — that's normally equivalent to full-viewport, but on mobile
browsers whose chrome (URL bar) shows/hides, fixed elements are sized to the
*initial* viewport and don't grow when the chrome collapses, leaving a gap that
shows `.desktop`'s fallback navy background through. Fixed by adding explicit
`width: 100vw; height: 100vh; height: 100dvh;` to `.desktop` (dvh cascades over
the vh fallback in browsers that support it) — belt-and-suspenders alongside
`inset: 0`, verified filling exactly to `window.innerWidth`/`innerHeight` at both
desktop (1280×800) and mobile (375×812) viewport sizes via direct JS
`getBoundingClientRect()` checks in the Browser pane.

**Liquid Glass restyle**: user asked for the shell chrome to follow Apple's newer
"Liquid Glass" material (WWDC 2025 / macOS Tahoe, iOS 26) instead of the flatter
dark-frosted look from earlier passes. Per real Apple behavior — and the
`ui-ux-pro-max` skill's own `liquid-glass` style entry ("Best For: navigation,
controls, and system-aligned app chrome") — this targets the **surrounding
chrome** (menu bar, dock, tooltips, flyouts), not the app icons' own brand
colors, which stay colorful/opaque under real Liquid Glass too. Changes in
`desktop.css`:
- `.menu-bar` and `.dock`: background is now a layered `linear-gradient` top-lit
  highlight over a thinner dark tint (was a flat `rgba(...)` tint), with much
  heavier `backdrop-filter: blur(34-38px) saturate(2.1-2.2)` (was
  `blur(20-24px) saturate(1.4-1.6)`) so they visibly sample/refract the
  wallpaper behind them, plus an `inset` top hairline highlight for a lit-glass
  edge instead of a flat panel.
- `.dock` border-radius went from 20px to 28px, pushing it toward the
  fully-rounded floating-pill shape Liquid Glass uses for the real macOS Dock.
- `.dock-icon` (and `.spotlight-result-icon`, same glyphs elsewhere) gained a
  `::after` diagonal white-to-transparent sheen overlay — the icon's own
  gradient background is unchanged, this just adds the same lit-glass surface
  language the chrome now has. Needed `position: relative; overflow: hidden`
  on the icon and `position: relative; z-index: 1` on its `<svg>` so the sheen
  clips to the icon's rounded corners without covering the glyph.
- `.dock-label` (hover tooltip) and `.dock-flyout` (Contact Links popover) got
  the same blur/gradient/border treatment for consistency with the dock they
  hang off.
- Added a `@media (prefers-reduced-transparency: reduce)` fallback (still
  WebKit-led browser support, so treat as progressive enhancement, not the
  primary a11y path) that swaps all of the above to solid opaque panels with
  `backdrop-filter: none`.
- Window chrome (titlebar, traffic lights, window body) was **not** touched —
  the user's ask was scoped to icons + top bar + bottom bar; window styling is
  a separate System Settings-style whites/frosted-light material in real macOS
  anyway, not the same Liquid Glass surface as nav chrome.

## Skills content expansion (2026-08-18)

Started with just adding `n8n` as a skill, then the user confirmed a much larger
batch of real skills to add after being asked for recommendations. `skills` in
`site.js` went from 13 flat entries to 31, and `SkillsApp.astro` now has **five**
grouping buckets instead of three (each still a plain keyword `Set` filtered
against the flat array — same pattern throughout, just more sets):

- **Languages** (unchanged pool minus what moved out): Java, C, Python, HTML,
  CSS, R, Delphi, C#
- **Frameworks & Tools** (`tools` Set) — gained `.NET`, `Blazor`, `PostgreSQL`
  (replaced the old generic `SQL` entry — user's actual DB experience is
  specifically Postgres), `REST APIs`, `Docker`, `Git`, `NUnit` (their actual
  testing framework — don't swap this for Jest/xUnit if asked to "add testing"
  again, this is the confirmed one) alongside the pre-existing Dart+Firebase/
  PIXI.js/Svelte.
- **Cloud (AWS)** (`cloud` Set) — the old single generic `"AWS"` entry was
  **replaced** with 8 specific services the user actually named: API Gateway,
  Cognito, Step Functions, Lambda, S3, EC2, DynamoDB, Bedrock (all prefixed
  `AWS ...` for clarity outside the group's visual context, e.g. in Spotlight
  search). If more AWS services come up, add them here individually rather
  than re-collapsing back to one generic "AWS" chip — that was the whole point
  of this change.
- **Automation** (`automation` Set): `n8n` — unchanged from the previous entry
  above, kept as its own bucket in case Zapier/Make etc. get added later.
- **Agile & Collaboration** (`collaboration` Set, new) — new indigo accent
  (`#a5b4fc → #4f46e5`, distinct from all other group/app accents in the
  site): `Agile`, `Jira`, `Confluence`, `CI/CD`. `CI/CD` is deliberately
  **not** named after a specific tool (GitHub Actions/Azure DevOps) — the user
  confirmed the category but never named which specific tool, so don't
  sharpen it to a specific product name without asking.

**Explicitly declined**: Terraform / IaC — user does not use it, don't add it
back if "recommendations" come up again in a future session.

**Descriptive copy**: the user also asked for the Skills app to read like it'd
matter on a CV rather than a bare tag cloud. Added a `skills-intro` paragraph
under the `<h2>` (renamed from "Programming Languages" to plain "Skills" since
it now covers far more than languages) plus one `group.description` sentence
per bucket, rendered as `.skill-group-desc` right under each group's title/rule
— e.g. Cloud's reads "AWS services used day-to-day to design, deploy, and scale
backend game services." Keep new groups following this same pattern (one
sentence of real context, not filler) rather than reverting to bare chip lists.

`CONTENT.md`'s Skills section was restructured to mirror these same five
groups (was previously one flat bullet list under "Skills (Programming
Languages)") — keep the two in sync per this repo's standing convention.

**Alignment fix (same day)**: the "Creative pass" session (see above) had given
`.skill-tile` a `--stagger` custom property (`(i % 3) * 6px` on `translateY`) for
a staggered, non-flat baseline. The user found this actively bothered them once
the group grew to 31 tiles — removed the `--stagger` var entirely from both the
template and `.skill-tile`'s base/hover CSS, so all tiles in a row now share one
flat baseline (`align-items: stretch` on `.skills-grid`, hover is a plain
`translateY(-4px) scale(1.04)` with no stagger offset baked in). Since the tile
no longer owns a resting `transform`, it was switched from `.reveal` (opacity-
only) to `.reveal-rise` (fade + rise) for its scroll-reveal — see the "Scroll-
reveal system" entry above for why that distinction exists. Don't reintroduce a
per-tile baseline offset here without checking back with the user first — this
was a deliberate reversal of an earlier design choice, not an oversight.

**Language/framework split (same day)**: the merged tiles `"Dart + Firebase"`
and `"JavaScript/TypeScript + PIXI.js"` were split into their real underlying
skills at the user's request: **Languages** gained `JavaScript`, `TypeScript`,
`Dart` (and `Svelte`, moved out of `tools` into the Languages bucket by simply
removing it from the `tools` Set — note this means Svelte is filed as a
"language" here even though it's technically a framework; that's the user's
explicit call, not an oversight). **Frameworks & Tools** gained `Flutter`
(Dart's framework), `React`, `PixiJS` (split out of the old merged label), and
`Firebase` (split out, kept here rather than under Cloud since that group is
scoped to AWS specifically). The Cloud group's description was also trimmed
from "...scale backend **game** services" to "...scale backend services" — the
user wanted it framed more generally, not game-specific. The `skills-intro`
paragraph had its trailing clause ("so it's easy to see where the hands-on
depth actually is, rather than one flat list of tags") removed — it now just
reads "grouped by area." Keep it that short if asked to touch this copy again.

**Small follow-up additions (same day)**: `AWS SNS` and `AWS SQS` added to the
Cloud group, `Postman` added to Frameworks & Tools. Two things the user
explicitly declined when asked for more recommendations, so don't re-suggest
them without new information: mentioning the Bedrock-driven translation/scoring
prompt work as its own skill line (user was unsure and left it as-is — the
existing `AWS Bedrock` chip already covers it), and any client-side game engine
(Unity etc.) — the client referenced in Experience is an **internal library**,
not a public engine, so there's nothing to name there.

## About/Experience content rewrite (2026-08-18)

User asked for research + recommendations on what an "About" section should
cover, then approved the recommendation and asked for it to be applied along
with a new Experience detail. Changes in `site.js` (+ `AboutApp.astro` +
`CONTENT.md` kept in sync):

- **`hero.headline`/`hero.subhead`** rewritten from generic resume-speak
  ("Demonstrated ability to excel...", "Building clean, dependable software
  with a data-informed mindset") to specifics naming Games Global, AWS/C#, and
  the actual nature of the work.
- **`about.summary`** rewritten to name concrete things instead of vague
  claims: the Blazor simulation tool (see below), the AI/Bedrock translation
  tool, the Stellenbosch BSc (Data Science focus), and mentoring — all facts
  that already existed elsewhere in the site (Experience/Academics) but
  weren't surfaced in the first thing a visitor reads.
- **`about.facts`** changed from `Nationality`/`Age`/`Sex` to `Location`/
  `Role`/`Focus`. Reasoning given to the user: age/sex are commonly omitted
  from professional-facing materials (bias risk, low relevance to hiring
  decisions) and location/role/focus serve a hiring reader better — the user
  accepted this as part of the broader recommendation. `AboutApp.astro`'s
  `factIcons` map was updated to match (`Location` → map pin, `Role` →
  briefcase, `Focus` → bullseye/target) — if `about.facts` labels change again,
  keep `factIcons`' keys in lockstep, and note the object's fallback icon
  (`factIcons[label] ?? factIcons.Focus`) needs its fallback key updated too if
  `Focus` is ever removed.
- **Experience** — the Level 1 (Games Global, current) entry's `description`
  now names a specific project instead of the generic "Built internal
  automation tools to streamline processes": a **Blazor-based simulation
  management website** hosted on a remote machine, used to request/run/sign
  off game simulations for release, plus ad-hoc testing by spawning games via
  CLI on the remote host, driving them via HTTP requests, and launching the
  client to validate changes visually and functionally. The user said they'll
  likely add more Experience detail on this later — if so, this is the entry
  to extend, not a new one (it's the same ongoing Level 1 role/period).

**Focus wording correction (same day)**: user clarified their base focus is
**.NET/C#, with AWS alongside** — not the other way round. `hero.headline`
("C# and .NET at the core, AWS alongside", was "AWS and C# by day"),
`hero.tags` (`.NET + C# Focus`, was `AWS + C# Focus`), and `about.facts`'
`Focus` value (`.NET + C# (AWS)`, was `AWS + C#/.NET`) were all reordered to
lead with .NET/C#. Keep this ordering in any future copy — AWS is
infrastructure they use, not the primary skill framing.

**Factual correction (same day)**: `about.summary` previously said "AWS-backed
game backends" — **wrong**. Per the user: game backend systems are **.NET/C#
projects**, not hosted/backed by AWS. AWS is specifically what the AI-powered
**translation tool** runs on (Bedrock) — that's the one place AWS genuinely
sits behind something described in About/Experience. Fixed to "building
.NET/C# game backends, ... and an AI-powered translation tool on AWS Bedrock".
If you touch this copy again: **don't** describe the game backends themselves
as AWS-hosted — only attribute AWS specifically to the translation tool (and
whatever else is confirmed AWS-specific, e.g. the Cloud skills list), not to
backend services generally.

**Closing line simplified (same day)**: the summary's last clause ("I like
keeping one foot in data-driven thinking even while shipping production
C#/.NET code") was vague — user asked what it meant, which was itself a
signal it wasn't landing. Replaced with a plainer closing: "...and I'm always
looking for the next thing to build or learn." Don't reintroduce abstract
"mindset"-style claims here without something concrete backing them.

## Resume PDF viewer: hide sidebar, show bigger (2026-08-18)

User reported the embedded PDF preview was opening with a page-thumbnail
sidebar on the left, squeezing the actual document into a small pane. The
iframe just points at a static `.pdf` file, so the browser's native PDF
viewer (Chrome/Edge PDFium, Firefox PDF.js) renders it — no custom viewer
code in this repo to fix directly. Used the standard [Adobe "open parameters"](https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf)
URL-fragment convention that PDF viewers widely (if inconsistently) respect:
`ResumeApp.astro`'s iframe `src` is now
`` `${base}DiehanCV.pdf#toolbar=0&navpanes=0&pagemode=none&view=FitH` `` —
`navpanes=0`/`pagemode=none` both target hiding the thumbnail/bookmark sidebar
(different viewers key off different param names, so both are included
defensively), `toolbar=0` hides the viewer's own toolbar (fine since the page
already has its own "Download PDF" button and an "Open the PDF directly"
fallback link outside the iframe), and `view=FitH` fits the page to the
frame's width instead of showing it zoomed out.
**Caveat**: support for these fragment params varies by browser/version and
isn't scriptable from this repo — some browsers (notably newer Chrome builds)
may partially ignore them. There's no fully reliable cross-browser way to
force this from a plain `<iframe src="file.pdf">` short of shipping a custom
PDF.js viewer, which wasn't done here (extra dependency/bundle weight for a
single preview pane) — if a browser still shows the sidebar after this, that's
the viewer overriding the hint, not a bug in this code.
Also bumped the visual size to make the document easier to read: the iframe's
CSS height went from `min(70vh, 720px)` to `min(78vh, 860px)`, and the
Resume window's default size in `apps.js` went from 640×600 to 760×760.

## Contact Links flyout: hover-gap fix + Call removed (2026-08-18)

User reported the LinkedIn/Email links in the dock flyout felt broken — they'd
show on hover but disappear before a click could land, and asked for the popup
to just work with hover-then-click instead of needing a pin-click first.
**Root cause**: `.dock-flyout` sits `bottom: calc(100% + 14px)` above the dock
icon — a 14px gap with nothing rendered in it. The old CSS trigger was a raw
`.dock-item-links:hover .dock-flyout { opacity:1; pointer-events:auto; }`.
Moving the cursor from icon to flyout crosses that gap; at that exact moment
the pointer is over neither the icon nor the flyout, so `:hover` on
`.dock-item-links` drops **instantly**, and since `pointer-events` isn't
animatable it snaps to `none` right then too — even mid-fade, before the
opacity transition finishes. The flyout was genuinely unclickable during that
crossing, not just visually finicky.

**Fix**: replaced the raw `:hover` trigger with a JS-managed `.hover-open`
class (`DesktopScript.astro`, same `.dock-item-links` forEach block that
already handled the click-to-pin `.open` toggle). `mouseenter` on the
`.dock-item-links` wrapper adds `hover-open` and clears any pending close
timer; `mouseleave` schedules removal after a 250ms delay instead of
removing it immediately. Because `.dock-flyout` is still a DOM descendant of
`.dock-item-links`, landing on it after crossing the gap re-fires
`mouseenter` on the wrapper and cancels the pending close — verified directly
in the Browser pane by dispatching synthetic `mouseenter`/`mouseleave`
events and checking `.hover-open` survives a quick gap-crossing re-entry but
is correctly removed ~250ms after a real, non-recovered leave. `:focus-within`
(keyboard) and `.open` (tap/click pin, still there for touch) don't have this
gap problem and remain direct CSS triggers, unchanged. Same swap applied in
the mobile media query block for consistency. Escape now also clears
`.hover-open`, not just `.open`.
**If you touch this again**: don't go back to a bare `:hover` selector on
`.dock-item-links` for the flyout — the gap between trigger and flyout is
structural (it's how the flyout is positioned), so any hover-only fallback
without the debounce will reintroduce this bug.

**Call removed**: the `contactLinks` array in `Dock.astro` no longer has a
`call`/phone entry (its glyph was also removed from `linkGlyphs`), and
`contact.phone` was removed from `site.js` entirely — user said it's not
needed. `ContactApp.astro`'s hint line was updated from "LinkedIn, GitHub, and
phone" to "LinkedIn and GitHub" to match.

**GitHub still pending**: `contact.github` is still `""` — the user asked for
it to show but hasn't provided the actual profile URL yet. It'll appear in the
flyout automatically the moment that field is filled in; don't invent a URL.

## Achievements page: Professional highlight added (2026-08-18)

User asked for their opinion, given they had said the page was entirely
pre-career (school + university) with nothing from their now ~1.5 years of
actual work — see the recommendation given, then confirmed. Added:

- **New `achievements.professional` array + `professionalIntro`** in
  `site.js`: career progression (Intern → Software Developer Level 1 in under
  a year, sole ownership of service development), mentoring a new developer,
  and completing the AWS Solutions Architect Associate course. **Worded
  carefully** — "completed the ... course", not "AWS Certified Solutions
  Architect" — the user said they completed a course, not that they passed
  the certification exam. Don't upgrade this wording to a certification claim
  without the user explicitly confirming they hold the actual credential.
- **`AchievementsApp.astro`**: this renders as a new full-width `trophy-hero`-
  styled card (`.trophy-professional`) placed **above** the existing
  Academic/Culture+Sports grid — deliberately first in reading order, since
  for a working professional's portfolio, professional achievements
  outweigh school ones for a hiring-facing audience. It reuses the existing
  `.trophy-hero` gold visual language (no new accent) since it's the same
  "achievement highlight" register as Academic, just a different subject.
  Reveal-stagger delays for the cards below were bumped accordingly
  (Academic 0ms→90ms, Culture/Sports side 90ms→180ms, University 160ms→260ms)
  since Professional now occupies the 0ms slot.
- **`academics.highlights`** (new array, currently one entry): "Runner-up, Top
  Undergraduate BSc Computer Science Student, Stellenbosch University" —
  rendered as a small bullet list right under the University Education card's
  intro paragraph, above the per-year marks tables. This is a **university**
  honor, not a Robertson High School one, so it does NOT belong in
  `achievements.academic` (that array's `academicIntro` is explicitly scoped
  to "Robertson High School (2017-2021)") — keep university-specific
  accolades in `academics.highlights`, not the school-scoped list, if more
  get added later.
- **Still open**: "CSV Team Leader" under Culture is still an unexplained
  acronym — flagged to the user as worth clarifying, not yet resolved.

## Work app rebuilt on ProjectsScreenshotsAndInfo (2026-08-20)

User pointed at a repo-root folder, `ProjectsScreenshotsAndInfo/<slug>/`, containing
a `content.md` write-up + screenshots per project (10 projects total) and asked for
the Work app to be rebuilt around it: cards that open into a screenshot carousel with
the technical write-up below, curated for a software-engineer CV.

**Data flow / source of truth** (also documented in `CONTENT.md`'s Portfolio
section — read that first if this drifts):
- `ProjectsScreenshotsAndInfo/<slug>/content.md` is the **full, detailed** write-up
  (course/client context, architecture prose, every screenshot's caption, a note on
  how screenshots were captured) — treat it as the canonical source when a project's
  facts need correcting.
- `src/data/projects.js` (**new file**, replaces the old `projects` array that used
  to live in `site.js` — that array is gone) is a **curated trim** of each
  `content.md`: `slug`, `title`, `context`, `stack[]`, `role` (optional), `repo`
  (optional), `summary`, `highlights[]` (3-4 picked, not every bullet from the
  source), `images[]` (`{file, caption}`). This is deliberately NOT a full copy —
  the user asked for "the important parts for a CV ... focusing on technical
  things", so highlights were hand-picked for technical substance, not pasted
  wholesale. If asked to update a project, edit `content.md` first, then bring the
  trim in `projects.js` back in sync — don't let them drift.
- **Screenshots are duplicated**, not referenced in place: copied from
  `ProjectsScreenshotsAndInfo/<slug>/*.{png,jpg,jpeg}` into `public/Projects/<slug>/`
  (a one-time `cp`, not a build step) because Astro only serves files under
  `public/` — the source folder isn't reachable at runtime. **If a screenshot is
  ever added/changed in `ProjectsScreenshotsAndInfo/`, it must be manually
  re-copied into the matching `public/Projects/<slug>/` folder**, there's no
  automated sync between them.
- **Verified against the filesystem before authoring**: `cs114-impasse` and
  `cs144-moving-maze`'s `content.md` screenshot tables each reference a 3rd
  "console mode" file (`03-text-mode-console.png`) that was never actually saved to
  disk — only 2 images exist for each in the source folder. `projects.js`
  deliberately omits that 3rd entry for both rather than linking a broken image.
  Don't add it back unless that screenshot actually gets captured and dropped into
  the source folder.
- **Old `public/Photos/` project images removed**: `decsoft.jpg`, `imp1/2.jpg`,
  `ios1-10.jpg`, `mvz.jpg`, `tictactoe.jpg`, `wedding1/2.jpg` were deleted — fully
  superseded by `public/Projects/`, and nothing referenced them anymore.
  `Photos/pfp.jpg` (profile photo) and `Photos/wallpaper-hills.jpg` (desktop
  background) are unrelated and were kept.
- **Tic Tac Toe dropped**: the old six-project list included a "Tic Tac Toe" game
  with no corresponding `ProjectsScreenshotsAndInfo/` entry. User confirmed that
  folder is the definitive project list, so it wasn't carried forward. If it comes
  back, it needs a `ProjectsScreenshotsAndInfo/tic-tac-toe/content.md` +
  screenshots first — don't hand-add it directly to `projects.js` without that.
- **Ordering is deliberate, not alphabetical/chronological**: `projects.js` orders
  by "strongest/most production-like first" — Propagen Website, the Propagen client
  site, then substantial university group/solo projects, ending with the simplest
  personal project (Wedding Table Allocation). `projects[0]` is also used as the
  featured (2-column) card in the grid — keep that in sync if reordering.

**`WorkApp.astro` rewrite**:
- Grid cards now show a thumbnail, title, a `context` line (course/client/personal),
  and up to 4 stack chips (`+N` overflow badge beyond that) — replacing the old
  single-sentence description, since stack-at-a-glance matters more for a technical
  CV audience than prose.
- Clicking a card opens `.project-dialog` (renamed from the old `.gallery-dialog`),
  which now has **two parts in one scrollable dialog**: the existing image
  carousel (prev/next arrows, thumbnail strip, keyboard arrows — unchanged
  mechanics) with each image's **real caption** from the source `content.md`
  table shown under it (previously just "N / total"), and below that a
  `.project-detail` panel — title, context, stack chips, role (hidden via
  `:empty` CSS if absent), summary, a "Technical highlights" bullet list, and a
  "View repository" link (hidden unless `project.repo` is set).
- **Data handoff to the client script**: `WorkApp.astro`'s frontmatter builds a
  `clientProjects` array (same shape as `projects.js` but with `image.file` already
  resolved to a full `public/Projects/...` URL) and serializes it into a
  `data-projects="..."` JSON attribute on the dialog (`JSON.stringify` — Astro
  HTML-escapes it automatically, matching the existing `data-images` pattern this
  file already used). The client `<script>` parses that once and looks up the
  clicked card's project by `data-slug`, rather than re-deriving `base`/URLs in JS.
- Verified end-to-end in the Browser pane: all 10 cards render, a project **with**
  role+repo (Bar Valley Properties) shows both, a project **without** either
  (Gomoku AI) correctly hides both, next/prev correctly updates the caption, and
  single-image projects (Gomoku, DFA compression) correctly disable both nav arrows.

**Follow-up same day — uniform card sizing + no university/course mentions**:
- User wanted every project card **exactly the same size**, even maximized,
  accepting some content getting visually tight as the tradeoff. The grid used
  to give the "strongest" project (`projects[0]`) a 2-column span + taller
  thumb (`.project-card-featured`) — removed entirely, along with the
  `featuredSlug` logic in the frontmatter. `.project-card` is now a **fixed
  300px-tall flex column** (thumb fixed 160px, body `flex:1`), with the title
  clamped to 2 lines (`-webkit-line-clamp`), context truncated to 1 line
  (`text-overflow: ellipsis`), and the stack-chip row capped to one row via
  `max-height` + `overflow: hidden` — all specifically so body content never
  pushes a card taller than its neighbors. Verified maximized: all 10 cards
  measured identically (347×288 at one tested window size). **Don't
  reintroduce a featured/span-2 card** without checking with the user first —
  this was a deliberate reversal of the earlier design, not an oversight.
- User also asked to **never mention university or course** anywhere in the
  project cards. The six Stellenbosch-coursework projects' `context` field in
  `projects.js` (`"CS114 — Stellenbosch University, 1st Year"` etc.) was
  changed to `"Team project"` for the two group projects (E-Spaza, InkLink) and
  `"Personal project"` for the four solo ones (Gomoku, DFA compression, Moving
  Maze, Impasse) — matching the phrasing already used for the non-coursework
  personal projects. The Work app's intro paragraph also had "university
  coursework" reworded to "personal builds". **If new projects get added to
  `projects.js`, don't put course/university info in the visitor-facing
  `context` field** — that detail can stay in `ProjectsScreenshotsAndInfo/`'s
  `content.md` (which the user hasn't asked to scrub), just not in what
  actually renders.

## Work app: two real bugs found chasing "cards misaligned" + "dialog shows nothing" (2026-08-20)

User reported two things that turned out to have one shared root cause and one
genuinely separate bug. Both fixed in `WorkApp.astro`.

**Bug 1 — dynamically-created elements don't get Astro's scoped-style attribute.**
The project detail dialog appeared to show "nothing about the project" below the
carousel. Root cause: `.gallery-thumbs img`, `.project-detail-stack .chip`, and
`.project-detail-highlights li` were all scoped CSS rules targeting elements
created via `document.createElement()` in the `<script>` block (thumbnails,
stack chips, highlight bullets). **Astro only stamps its scoped `data-astro-cid-*`
attribute onto elements present in the component's own template at build/render
time — never onto elements a client script creates afterward** — so none of
those three rules ever matched anything. The visible symptom was extreme:
unstyled thumbnail `<img>`s rendered at their natural size (~700×1900px each,
capped only by global.css's `img { max-width: 100% }`) instead of 44×44,
pushing the actual `.project-detail` (title/summary/highlights) around **8000px**
down inside the dialog's scroll area — so a user opening a card and not
scrolling an absurd distance would see only the carousel and conclude there
was no write-up at all. Fixed by wrapping the dynamic-element part of each
selector in `:global(...)` (`.gallery-thumbs :global(img)`,
`.project-detail-stack :global(.chip)`, `.project-detail-highlights :global(li)`
— see the inline comments at each rule). **This is a general gotcha, not
specific to this bug**: any future `document.createElement()` in an Astro
component's `<script>` needs its styling rules written with `:global()` around
the dynamic-element selector, in this file or a new one — grepped the rest of
`src/` for `document.createElement` and confirmed WorkApp.astro is currently
the only file using this pattern.
Also bumped the dialog itself larger per the user's request while fixing this
(`width: min(90vw,760px)→min(94vw,920px)`, `max-height: 85vh→90vh`) — with the
thumbnail bug fixed, the full write-up now fits without scrolling at most
common window sizes anyway, but the extra size was asked for directly, not
just a side effect of the bug fix.

**Bug 2 — per-card scroll-reveal was gating on scroll for a compact grid.**
Cards beyond the first row appeared to be "slightly lower" / not lined up when
the Work window was maximized. This was the site-wide scroll-reveal system
(see "Scroll-reveal system" above) working exactly as designed — rows below
the visible fold of the window start at `opacity:0; transform:translateY(18px)`
until scrolled into view or the window is resized/maximized in a way that
brings them into `.window-body`'s visible clipped rect — but for a dense
project grid where the user expects to just see cards, not scroll to "unlock"
rows, that reads as a bug, not an animation. Removed `reveal-rise` (and the
per-card `--reveal-delay` stagger) from `.project-card` entirely; the grid div
itself (`.project-grid`) is still a direct child of `.app-content` and already
gets the existing `.window.open .app-content > *` entrance stagger, so all
cards now simply appear together when the window opens — no scroll-gating, no
per-row alignment lag. Verified: after this fix, every card measured
`opacity:1; transform:none` immediately after opening/maximizing, with
uniform 311px row spacing across all 5 rows. **Don't reintroduce `reveal-rise`
on individual grid cards in a dense card grid** — it's the right pattern for
long vertically-scrolled content per app (About, Skills, Achievements, etc.),
wrong for a compact grid meant to be seen all at once.

## Performance: scroll-reveal was unthrottled (2026-08-20)

User reported the site felt "extremely laggy." Root cause: the scroll-reveal
system (see "Scroll-reveal system" above) was wired to a **raw, unthrottled
`scroll` listener on every `.window-body`**, and on every single scroll event
it ran `document.querySelectorAll(".reveal:not(.is-visible), ...")` plus a
`getBoundingClientRect()` call (forces synchronous layout) for every
not-yet-revealed element on the page. That's real, measurable jank on a
scroll gesture (which can fire dozens of events per second) — a classic
layout-thrashing anti-pattern. It was written this way specifically to work
around this sandboxed Browser pane never firing IntersectionObserver
callbacks (a test-tool quirk, confirmed by direct test — see the git history
of this section) — but that traded away real performance for every actual
site visitor to accommodate one test environment. Fixed in
`DesktopScript.astro`:
- **IntersectionObserver is now the primary mechanism** (`revealObserver`) —
  cheap, browser-native, and correctly respects `.window-body` clipping via
  modern browsers' "clip by all scrolling ancestors" IO behavior. Every
  `.reveal`/`.reveal-rise` element is observed once at load; IO fires
  automatically both on scroll AND on a window's `display:none→flex`
  transition when it opens, so no manual per-window wiring is needed for that
  case anymore.
- `revealVisible()`/`isInView()` (the manual `getBoundingClientRect` checker)
  still exist, but are now **direct-call-only** — invoked once at load, and
  at the `openWindow`/`restoreMinimized`/`maximizeWindow` call sites (cheap,
  since those only run on discrete user actions, not every scroll frame).
  **No scroll or resize event listeners are attached to this checker
  anymore.** This is what still makes the reveal system testable in this
  sandboxed pane (where IO never fires) without costing real visitors
  anything on scroll.
- **If this needs a broader fallback later** (e.g. IO turns out to be
  unreliable somewhere in practice), throttle it — a rAF-gated ticking guard,
  not a raw listener — before reintroducing scroll/resize wiring. Don't put
  back an unthrottled scroll listener here.
- Other things checked and ruled out as the primary cause but worth knowing
  about if lag is still reported after this: the "Liquid Glass" restyle (see
  above) uses fairly heavy `backdrop-filter: blur(34-38px) saturate(2.1-2.2)`
  on the menu bar and dock, which sit over a large photographic wallpaper —
  backdrop-filter at this blur radius is one of the more GPU-expensive CSS
  properties, especially on lower-end hardware. Not touched this round since
  the unthrottled-scroll bug was the clear, concrete, verifiable culprit, but
  if lag persists after this fix, that's the next thing to look at (would need
  the user's buy-in first, since it's a deliberate visual choice, not a bug).

## "View repository" button removed for now (2026-08-20)

User asked to not show a repository link on project cards for now. Removed the
`<a class="project-detail-repo">` element, its CSS, and its JS wiring
(`detailRepo` in `WorkApp.astro`'s script) entirely — not just hidden via
CSS. The `repo` field itself is still present in `projects.js` and the
`Project` TS type (harmless, still-valid metadata for two projects), so
re-adding the button later is a small, contained change — re-add the
`<a>` element + `.project-detail-repo`/`.visible` CSS + the `detailRepo`
lookup/toggle logic removed here, don't need to touch `projects.js`.

## Performance: project screenshots were 5-20x too big (2026-08-20)

Fixing the unthrottled-scroll bug above didn't fully fix it — user reported it
was "still slightly laggy but only when opening one of the portfolio projects."
Checked `public/Projects/` file sizes directly: **23MB total**, individual
files up to **2.6MB** (`instagram-clone/03-feed.jpg`), several others over
1MB — served at native resolution (some genuinely huge, e.g. 1440×3965 full-
page captures) despite only ever being displayed at ≤42vh in the carousel or
44px in the thumbnail strip. Opening a project loaded/decoded every one of
that project's images near-simultaneously (thumbnails render the same
full-size file as the main image, not a separate small variant) — for a
project like `instagram-clone` (10 images) or
`propagen-client-website-template` (8 images), that's several MB of
simultaneous image decode work on the main thread, which is exactly what a
user would feel as lag specifically when opening a project.

**Fix**: a one-off Node script (`sharp`-based) resized every file in
`public/Projects/` to fit within 1600×2400 (`fit: "inside",
withoutEnlargement`) and re-compressed (PNG: `quality:80, palette:true`;
JPEG: `quality:80, mozjpeg`), **in place, same filenames** — `projects.js`
needed zero changes. Only overwrote a file if the result was actually
smaller (never regressed an already-small file). **Result: 23.1MB → 4.31MB
(~81% smaller)**, with the worst offender (`instagram-clone/03-feed.jpg`)
going from 2.6MB to 143KB. Did **not** touch `ProjectsScreenshotsAndInfo/` —
that folder stays the full-resolution source archive; only the served
`public/Projects/` copies were shrunk.
**The script itself was deliberately removed after this one-time run**
(2026-08-20, same day) — the user didn't want it kept around as a permanent
part of the repo, and `sharp` was removed from `devDependencies` +
`package-lock.json` (via `npm install --package-lock-only`, not hand-edited)
along with it, since nothing else in the repo uses it. **If new project
screenshots get added later and feel oversized again**: there's no
ready-to-run script anymore — either write a similar one-off `sharp` script
again (same approach: resize to fit within ~1600×2400, `quality:80`,
overwrite only if smaller, leave `ProjectsScreenshotsAndInfo/` alone) or
manually compress before copying into `public/Projects/<slug>/`. Don't
assume a script still exists here.
Also added `loading="lazy"` + `decoding="async"` to the dynamically-created
thumbnail `<img>`s and `decoding="async"` + `fetchpriority="high"` to the
main carousel `<img>` in `WorkApp.astro` (these were **not** reverted — only
the one-off script and its dependency were) — so the browser prioritizes the
image the user is actually looking at over the off-screen-ish thumbnail
strip.

## Menu bar simplified: name only, no app nav buttons (2026-08-20)

User asked to remove the About/Skills/Portfolio/etc. text buttons from the
left side of the menu bar, keeping only the name. `MenuBar.astro` no longer
imports `apps.js` or maps over it — `.menu-left` is now just the logo dot +
`Diehan Drotschie` brand text, nothing else. The now-dead mobile CSS rule
hiding those buttons (`.menu-left .menu-item[data-open]` in the
`@media (max-width: 900px)` block in `desktop.css`) was removed too, since
there's nothing left for it to target.
**Navigation is unaffected** — the Dock and ⌘K Spotlight search are still the
way to open any window; this only removed the *redundant* top-bar text-button
shortcut to the same windows. `.menu-bar button.menu-item` base styling is
still used by the Search trigger on the right side, so that CSS rule stays.
If asked to bring per-app nav back to the menu bar, it's a straightforward
revert: re-add the `apps.js` import + `.map()` loop that was removed here.

**Housekeeping note**: the parent folder this repo lives in was renamed from
`CV_Website` to `Diehan_CV` between sessions (still
`.../Dev/Diehan_CV/DiehanDrotschieCV.github.io`, same git repo/remote/branch
— confirmed via `git remote -v` before touching anything). Nothing in the
repo itself referenced the old parent folder name, so this needed no code
changes, just noting it here in case a future session's memory/notes still
say `CV_Website`.

## Menu bar shortcuts: OS-correct labels + Contact made functional (2026-08-20)

User (on Windows) pointed out the hint row showed `⌘C`/`⌘K` (Mac-only Command
key symbol) and that the Contact and Help hints didn't actually do anything —
only ⌘/Ctrl+K (Spotlight) was ever wired up.

- **OS-correct labels**: every relevant `<kbd>` (hint row's Search/Contact and
  the Search trigger button's badge) has class `mod-key` + `data-key="K"`/`"C"`,
  starting as `⌘K`/`⌘C` in the markup. A script in `DesktopScript.astro` checks
  `navigator.userAgent` for `Macintosh` (excluding iPhone/iPad/iPod, which
  report Mac-adjacent strings but have no physical Command key) and rewrites
  every `.mod-key` element to `Ctrl+<key>` for everyone else. Verified on this
  Windows dev machine: all `.mod-key` elements correctly read `Ctrl+K`/`Ctrl+C`.
  A brief flash of `⌘` before the script runs is an accepted tradeoff (same
  class of thing as the clock's blank first frame) — this can't be known at
  Astro's static-render time, only client-side.
- **Ctrl/Cmd+C now opens Contact** — but **only** when there's no active text
  selection and the visitor isn't focused in an input/textarea/contenteditable
  (`isTyping` check). Ctrl/Cmd+C is the universal browser "copy" shortcut;
  without this guard, a visitor selecting the email address (or any page
  text) and hitting copy would have gotten a Contact window popping open
  instead of an actual copy. **Don't remove this guard** if touching this
  again — it's not defensive boilerplate, it's the thing that keeps this
  shortcut from being actively hostile to normal browser use.
- Verified end-to-end in the Browser pane: dispatching Ctrl+C opens the
  Contact window. The "does Ctrl+C skip when text is selected" half of the
  guard couldn't be verified end-to-end here — `window.getSelection()`
  doesn't reliably persist across synthetic events in this sandboxed pane —
  but the guard condition itself (`!window.getSelection()?.toString()`) is a
  standard, correct pattern; noted as unverified-by-test rather than claimed
  as confirmed.

**Help panel removed same day**: a `?` → Help panel (new `HelpOverlay.astro`
component, listing shortcuts + usage tips) was built and wired up right after
the above, then the user said it wasn't necessary. Fully removed —
`HelpOverlay.astro` deleted, its import/usage in `index.astro` reverted, the
`? Help` hint-row entry in `MenuBar.astro` removed, and all Help-related JS
(`helpOverlay`/`helpClose`, `openHelp`/`closeHelp`, the `?` keydown branch,
`closeHelp()` calls in the Escape/Ctrl+C branches) removed from
`DesktopScript.astro`. **Don't re-add a Help panel unless the user asks again**
— this isn't a case of "still there but hidden," it's fully gone from the
codebase. (Transient note: deleting the component file while the dev server's
HMR was still tracking it produced two harmless 500s in that dev session's
console — resolved by a fresh page load/tab; not a real bug, nothing to
chase if it's ever seen again after a file deletion mid-session.)

## Copyright line updated (2026-08-20)

`MenuBar.astro`'s hint-row copyright changed from "© 2026 Diehan Drotschie ·
Static Astro build, no backend, no tracking" to "© 2026 Diehan Drotschie ·
Built using Astro and CSS" per the user's explicit wording.

## Project image lightbox: fullscreen zoom + pan controls (2026-08-25)

Added a "view full size" fullscreen lightbox to `WorkApp.astro`'s project
carousel, then extended it with proper zoom controls per a follow-up request:

- A zoom button (⛶, `.gallery-zoom`) in the corner of the main carousel image,
  plus the main image itself is now clickable — both open `.lightbox`, a
  fullscreen `<dialog>` showing the current image at "fit to screen" size
  with prev/next nav (kept in sync with the underlying carousel's `index`),
  caption, and close (close button, backdrop click, or Escape — the last one
  free from `<dialog>`'s native behavior, no extra JS needed).
- Zoom controls: a small pill-shaped control panel (`.lightbox-zoom-controls`,
  bottom-right) with − / % / + . Zoom is relative to the fit-to-screen view
  (100%), not native pixel size — `computeBaseSize()` measures that
  fit-to-screen width/height from `naturalWidth`/`naturalHeight` once the
  image loads, and zoom (100%–400% in 25% steps) multiplies it via an inline
  pixel `width`/`height` on `.lightbox-image`. At zoom > 1 the
  `.lightbox-viewport` wrapper gets `overflow: auto` and an `.is-zoomed`
  class, so panning is just native scrolling — a mousedown/mousemove/mouseup
  drag handler on the viewport adjusts `scrollLeft`/`scrollTop` (grab/grabbing
  cursor). Switching images (prev/next) resets zoom to 100%.
- Verified in the sandboxed Browser pane via direct JS state checks (per the
  usual pattern here — compositor-driven visual checks aren't reliable in this
  tool): confirmed 100% baseline, step-in to 150%/175% updates both the label
  and the image's inline px width, `.is-zoomed` toggles correctly, zoom-out
  hits a disabled floor at 100%, and navigating to the next image resets to
  100% with `.is-zoomed` removed.

## Contact Links dock icon: click now does nothing, hover-only (2026-08-25)

The Contact Links dock item (LinkedIn/Email flyout) used to support both
hover-to-open AND click-to-pin-open (`.open` class, toggled in
`DesktopScript.astro`, closed on outside click or Escape). The user said the
click behavior was unwanted — hover already does the job, so a click should
do nothing. Removed the click-to-toggle listener on `.dock-trigger` entirely
(and its now-dead `.open` class plumbing: the outside-click-close listener,
the Escape handler's `.open` cleanup, and the `.dock-item-links.open
.dock-flyout` CSS rule in both the desktop and mobile media-query blocks of
`desktop.css`). The flyout now opens only via `.hover-open` (JS-managed hover
with a 250ms close-debounce, unchanged) or `:focus-within` (keyboard). Don't
re-add click-to-pin without checking — this was a deliberate removal per
explicit user feedback, not an oversight.

**Follow-up bug from that removal, fixed same day**: after removing the click
handler, the flyout stayed open until the user clicked *elsewhere* instead of
closing when the mouse left it. Cause: the trigger `<button>` still gets
native focus on click, and the CSS rule that shows `.dock-flyout` is
`.hover-open` OR `:focus-within` — so once `hover-open` cleared on
mouseleave, `:focus-within` alone (from that leftover click-focus) kept it
open until focus moved elsewhere. Fixed by blurring the trigger inside the
existing mouseleave close-timer (only if focus is still inside `item`), so
`:focus-within` releases at the same time `hover-open` clears. `:focus-within`
itself is untouched — real keyboard/tab users still get it.

## Achievements: university table columns aligned across all 3 years (2026-08-25)

The `Mark` column in `AchievementsApp.astro`'s three per-year university
tables landed at a different x-position in each table, because each
`<table>` auto-sized its own `Subject` column width to its own longest
subject name (independent of the other tables). Fixed with `table-layout:
fixed` + explicit shared column widths (Subject 55% / Mark 20% / Remarks
25%) in `.table-scroll table` in that file's `<style>` block, so all three
tables now share identical column boundaries regardless of content length.
Verified via `getBoundingClientRect()` on each table's Mark `<th>` — all
three now report the same `left`/`width`.

## Resume PDF: trailing blank page removed (2026-08-25)

`public/DiehanCV.pdf` had a 3rd, fully blank page after the 2-page CV
content. Removed it with a one-off `pdf-lib` script run from the scratch
directory (installed via `npm install pdf-lib --no-save` in a scratch
folder, never touched this repo's `package.json`/`node_modules` — same
"one-off tool, remove after" pattern as the earlier image-optimization
script) — loaded the PDF, called `removePage(2)`, re-saved in place. Went
from 198.5KB/3 pages to 179.6KB/2 pages; content of pages 1–2 unchanged
(verified by re-reading the PDF after the edit). The scratch npm project was
deleted after the one-time run.

## Propagen/real-estate screenshots: restored native width, fixed zoom blur (2026-08-25)

User reported the Propagen and Bar Valley Properties (real estate) project
screenshots looked blurry when zoomed in via the lightbox. Root cause: the
original one-off image-compression pass (see "23MB→4.3MB" note above) used
`sharp(...).resize({ fit: "inside", width: W, height: H })` — for `fit:
"inside"`, BOTH caps apply proportionally, so a very tall full-page capture
(these are scrolling-capture screenshots, up to 8800px tall) got its WIDTH
crushed down to fit inside the height cap, not just its height. Concretely:
`propagen-website/04-showcase.png` went from a native 1440×8800 down to a
served 393×2400 — under a third of its real width — while normal-aspect
screenshots (hero shots etc.) were barely touched. Zooming into a
393px-wide image inevitably looks soft; there was no more resolution left
to reveal.

Fixed by re-deriving the 5 affected files from the untouched, full-resolution
originals in `ProjectsScreenshotsAndInfo/` (that folder is the canonical
source, `public/Projects/` is a derived/compressed copy — see the Work app
rebuild notes) using a **width-only** cap this time (`resize({ width: 1600,
withoutEnlargement: true })`, no height constraint) plus PNG palette
quantization (`.png({ quality: 82, palette: true, effort: 10 })`) instead of
downscaling for size control:

- `propagen-website/02-home-full.png`: 399×2400 → 1440×8657 (157KB→524KB)
- `propagen-website/03-pricing.png`: 755×2400 → 1440×4580 (171KB→358KB)
- `propagen-website/04-showcase.png`: 393×2400 → 1440×8800 (146KB→595KB)
- `propagen-client-website-template/02-home-full.png`: 872×2400 → 1440×3965 (317KB→440KB)
- `propagen-client-website-template/05-about.png`: 1297×2400 → 1440×2665 (183KB→106KB)

`public/Projects/` total went from ~4.3MB to ~6.6MB — still far below the
original 23MB, and images only load when a project card is opened (lazy
thumbnails + on-demand main image), so this shouldn't reintroduce the
scroll-lag issue those were fixed for. Verified via `naturalWidth` on the
loaded `<img>` in-browser (1440 as expected, was 393). Used the same
scratch-directory + `npm install --no-save` + delete-after pattern as the
original compression script and the PDF page-removal fix — nothing added to
this repo's `package.json`.

If more projects' tall screenshots ever look soft when zoomed, the same fix
applies: check `Image.open(...).size` on the `public/Projects/...` file vs.
the same path under `ProjectsScreenshotsAndInfo/...` — if the served width
is meaningfully smaller than the original, it got squeezed by the height cap
and needs the same width-only re-derivation.

## Resume PDF fully rebuilt from site data (2026-08-26)

`public/DiehanCV.pdf` was the *original* CV template from before this whole
Astro rebuild — it still had the old "Personal Information" block (Age,
Criminal Record, Gender, Nationality — none of which the website shows
anymore; `about.facts` moved to Location/Role/Focus early in this project)
and a phone number (`contact.phone` was removed from the site outright, see
above), plus an old, thin project list (Tic Tac Toe, Plinko, etc.) that
predates the 10-project `projects.js` rebuild. The user clarified that
`Diehan_CV/DiehanCV.pdf` (one level **above** this repo, not in it) is their
own personal backup copy and NOT the file to touch — `public/DiehanCV.pdf`
inside this repo is "the actual pdf in the website" they meant.

Rebuilt it from scratch to mirror current site data (`src/data/site.js` +
`src/data/projects.js`): Summary, Experience (all 3 roles, condensed to
bullets), Skills (grouped exactly like `SkillsApp.astro`'s 5 groups —
Languages / Frameworks & Tools / Cloud (AWS) / Automation / Agile &
Collaboration), all 10 Projects (title, stack, one-line summary each — no
university/course mentions, matching the site's project cards), Achievements
(Professional bullets + a condensed Academic list — dropped the Sport/Culture
categories and the full 24-course per-year marks tables for a tighter,
job-focused 2-page resume; flag to the user if they want those back), and
Education (BSc CS Stellenbosch + Senior Certificate, dates only, no marks
breakdown). Removed: Personal Information block, phone number.

Built via a scratch HTML file styled to match the site's blue accent
(`#1f8fe0`), rendered to PDF with a **local headless Chrome** print
(`chrome.exe --headless --disable-gpu --print-to-pdf=... "file:///<url-encoded
path>"` — no npm dependency needed this time, unlike the sharp/pdf-lib
one-offs). Two gotchas hit along the way: a bare relative filename argument
gets treated as a hostname to DNS-resolve (`DNS_PROBE_FINISHED_NXDOMAIN`), and
an unescaped space in the `file://` path 404s — needs `file:///` + `%20` for
spaces in a fully-qualified path. Verified by reading the rendered PDF back
and comparing every section to source data.

**Revised same day per follow-up feedback** — three changes, all now live:
1. Summary rewritten so the degree isn't a blunt standalone sentence — now
   opens with it as a clause ("Software Developer at Games Global with a BSc
   in Computer Science (Data Science) from Stellenbosch University, now
   putting that foundation to work...") instead of interrupting the flow.
2. The Personal Information block (Age/Gender/Nationality/Criminal Record)
   from the original pre-rebuild PDF is back — Gender/Nationality/Criminal
   Record carried over unchanged, but Age needed asking the user directly
   (the old PDF's "21 yrs" was stale and there's no way to derive current age
   from anything in this repo) — confirmed as 22.
3. "Accomplishments & Awards" restored to its full original scope: the
   Academic list is back to all 8 original bullets (Dux Award, Top 10
   Achievers, Student Council, 5-years honorary awards, 1st in Grade,
   SA Maths Olympiad, Golden Key, 94.57% average) plus the Culture (CSV Team
   Leader) and Sport (Hockey/Athletics/Swimming) categories that the first
   rebuild had dropped for brevity — turns out "keep minimal" meant trim the
   marks tables and project write-ups, not the awards themselves. The new
   Professional achievements section (from the website) stays alongside it,
   not instead of it. The 24-course per-year marks tables are still
   intentionally excluded (never in any version of this PDF, only ever
   lived in the website's Achievements app) — don't add those without
   checking, that's the one thing still deliberately out of scope.

Now 2 pages, ~97KB.

**Experience order flipped same day**: user wants the PDF's Experience section
oldest→latest (Internship → Graduate → Level 1) — reordered the PDF's HTML
to match. **Correction from a later sync audit**: this note originally
(wrongly) claimed the website was newest-first and this made the PDF diverge
from it — that was false. `site.js`'s `experience` array was already ordered
oldest→latest (Internship, Graduate, Level 1) before this change, and
`ExperienceApp.astro` renders it in array order with no reversal — so the
website was already oldest-first, same as the PDF now is. There was no
actual divergence to create or preserve here; ignore the "opposite of
newest-first" framing in the original version of this note. ~97KB, still 2
pages.

**Also fixed the same day, in both `site.js` and the PDF**: `achievements.sports`
had "Hockey: 0/19 A First Team" — the `0` was a typo/OCR artifact from the
original pre-rebuild PDF for "U/19" (Under-19). Corrected to "U/19" in both
places. Checked at the same time: every accomplishment from the old PDF's
"Accomplishments and Awards" (all 8 Academic bullets, Culture, Sport, the
Stellenbosch runner-up honor) was already mirrored on the website's
Achievements app before this fix — nothing else was missing.

**Two Experience bullets pulled back in from the pre-rebuild PDF, condensed**
(user quoted the exact old sentences and asked for them worked back in):
- Internship bullet now reads "Collaborated with a talented team on
  interactive gameplay features, gaining valuable hands-on experience in
  game development" — folds in the old PDF's "collaborated with a talented
  team" phrase that the rebuilt version had dropped, summarized to one line
  per the user's own instruction.
- Graduate bullet gained a new middle line: "Responsibilities included
  developing backend services for multiple games and creating an in-house
  AWS cloud solution with an internal web platform for running game
  simulations" — near-verbatim from the old PDF, since the user quoted that
  exact sentence and asked for it included as-is (not further condensed,
  unlike the internship one). Still 2 pages, ~98KB.

**Level 1 bullets edited again same day**: removed the "— plus CLI-driven
ad-hoc testing against a remote host" clause from the Blazor simulation
website bullet (now ends at "...for release"), and added a new bullet,
"Additionally, developed automation tools to streamline internal processes
and contributed to improving game architecture" — near-verbatim from the old
PDF, placed right after the mentoring bullet. Still 2 pages, ~99KB.

**Project content corrections, same day — applied to the PDF AND the live
website's `projects.js`/`site.js` (these weren't PDF-only wording tweaks,
they were factual/naming corrections that should be consistent everywhere)**:
- **Real Estate Website renamed**: `projects.js`'s title was "Bar Valley
  Properties — Real Estate Website" — the user asked to drop the client name
  entirely, so it's now just "Real Estate Website" (`context` stays "Client
  project, Propagen"). Also updated the one `CONTENT.md` reference to match.
  Don't reintroduce the "Bar Valley Properties" name without checking —
  likely a client-confidentiality reason, not just CV brevity.
- **Gomoku tournament claim removed**: `projects.js`'s summary said the agent
  "plays live matches in a round-robin tournament against other students'
  agents" — the user said the tournament didn't actually happen, so that
  clause is gone from both the website summary and the PDF's one-liner (now
  ends at "...to play live matches", no tournament claim). This was a factual
  correction, not a brevity edit — don't add tournament language back.
- **AWS course attributed to Udemy**: `achievements.professional` in
  `site.js` now reads "Completed the AWS Solutions Architect Associate course
  (Udemy)" instead of just "...course" — same change made in the PDF's
  Accomplishments & Awards section.

**PDF-only wording changes, same day** (these are just this rebuilt PDF's own
condensed one-liners, not sourced from `projects.js`, so no website change
needed):
- Real Estate Website PDF summary: dropped "...and security headers at the
  edge", now ends at "...serverless API layer and rate limiting".
- InkLink PDF summary: the user asked what "Yjs" and "CRDT-based concurrent
  editing" meant (jargon in their own project's write-up) — answered in chat
  (Yjs is a CRDT library: a data structure that lets multiple people edit the
  same document concurrently and always merges to the same result with no
  central lock/server arbitrating conflicts) and, since even the candidate
  found the phrasing opaque, reworded the PDF's summary in plain language:
  "multiple people can edit the same note at once, with changes merged
  automatically and no lost edits." `Yjs` stays in the stack tag next to the
  title; only the summary sentence was simplified. The full CRDT/Yjs
  explanation is still on the website (`projects.js`/`WorkApp.astro`
  highlights) — this was a PDF-brevity call, not a "remove Yjs" one.

Still 2 pages, ~99KB after all of the above.

**Culture achievement category removed entirely, website + PDF, same day**:
user asked to drop "CSV Team Leader" and the whole Culture category from
Accomplishments & Awards. Since this was content curation (not PDF-only
wording), removed it everywhere: `achievements.culture` deleted from
`site.js`, the Culture `trophy-section` + its `icons.culture` SVG path
deleted from `AchievementsApp.astro` (Sport now sits alone in the
`trophy-side` card — the `.trophy-section-divider` that used to sit between
Culture and Sport is now dead CSS with no divider left to style, so that rule
was deleted too), and the Culture column dropped from the PDF's two-column
Academic/Sport layout (Sport now fills the second column alone). Verified
in-browser: the Achievements window now renders exactly 3 trophy-header
titles (Professional, Academic, Sports), no orphaned divider, no console
errors.

**InkLink reworded to reflect actual (frontend-only) contribution, PDF-only**:
user was on the frontend of InkLink (matches `projects.js`'s existing `role:
"Frontend — one of three frontend devs on a 6-person team."`, which was
already correct on the website), but the PDF's one-liner summary — added
during the earlier Yjs/CRDT jargon-simplification pass — described the CRDT
merge behavior in a way that read as a claim of having built that
(backend-ish) conflict-resolution logic. Reworded to describe only the
frontend work: "Frontend work on a collaborative note-taking app: a
live-rendered markdown editor, note sharing/permissions UI, and real-time
updates as collaborators edit together" — and trimmed the PDF's stack tag
from the full team stack down to `React, TypeScript, WebSockets` (dropped
Express/Sequelize/PostgreSQL/Yjs, which are backend/infra the user didn't
personally build). The website's `projects.js` entry is untouched — its
`role` field already disambiguated this correctly, so only the PDF (which has
no per-project role line) needed the fix.

**Dash style, PDF-only**: user asked for plain hyphens (`-`) instead of
em-dashes (`—`) throughout the PDF. Every `—` in the scratch HTML source was
replaced with `-` (title/date separators, project title-stack separators,
mid-sentence breaks). En-dashes in date ranges were not part of this ask and
there weren't any left to worry about either way — the PDF's date ranges
already used plain hyphens. This is PDF-only; the website's own typography
(em-dashes throughout `.astro` components) is unrelated and untouched.

Still 2 pages, ~97KB.

## Full website/PDF content sync audit (2026-08-26)

User asked to double-check the website and `public/DiehanCV.pdf` contain the
same info and are up to date with each other. Did a full line-by-line
comparison of `site.js` + `projects.js` against the PDF's every section.
Found and fixed two real content gaps (both in `site.js`'s `experience`
array — the PDF had gained detail across several earlier edits this session
that never made it back to the website):

- **Graduate Software Developer description**: was "Focused on service
  development while upskilling in AWS and C#. Continued to contribute to
  interactive gameplay features across team projects." — missing ".NET" from
  the upskilling list and missing the "developing backend services for
  multiple games and creating an in-house AWS cloud solution with an internal
  web platform for running game simulations" sentence entirely (present in
  the PDF since the "include some of this sentence in the graduate experience
  as well" request). Added both to `site.js`.
- **Software Developer Level 1 description**: missing "Additionally,
  developed automation tools to streamline internal processes and
  contributed to improving game architecture" (present in the PDF since the
  automation-tools-bullet request). Appended it to the end of the existing
  paragraph in `site.js`.
- **Propagen Website stack tag in the PDF**: was missing "Framer Motion",
  which `projects.js`'s stack array has always included — an unexplained
  drop from the very first PDF rebuild, not a deliberate edit. Added it back
  to the PDF.

Verified all three fixes live: read the Experience window's rendered
paragraphs via JS after the `site.js` edit (both new sentences present,
word-for-word), and re-read the regenerated PDF page 1 (Framer Motion visible
in the Propagen stack tag). No console errors.

**Differences confirmed intentional, left as-is** (don't "fix" these without
checking first — they're deliberate, not gaps):
- PDF Personal Information (Age/Gender/Nationality/Criminal Record) has no
  website equivalent — `about.facts` shows Location/Role/Focus instead. User
  explicitly asked to keep both this way.
- PDF's Level 1 Blazor bullet omits the CLI-driven ad-hoc testing detail that
  the website's fuller prose still has — user explicitly said "remove this
  section" for the PDF; the website's richer narrative-style bio was never
  asked to drop it, and there's no reason a concise resume bullet needs the
  same depth as a "read more" web bio.
- InkLink's PDF stack/summary is deliberately narrower than `projects.js`'s
  (React/TypeScript/WebSockets only, no backend/CRDT claims) — reflects the
  user's actual frontend-only role on that project, which `projects.js`
  already stated correctly via its own `role` field; no website change was
  needed there.
- E-Spaza's PDF stack condenses "Apollo Client, Apollo Server, TypeGraphQL"
  down to just "GraphQL" — this was the original PDF rebuild's editorial
  choice from the start, not a later regression, and holds up fine as a
  resume-level simplification.
- Dash style (`-` vs `—`) differs between the two by design — PDF-only
  request, website typography untouched.
- The Runner-up honor appears in the PDF's Academic list but lives under
  `academics.highlights` (the University Education card) on the website, not
  `achievements.academic` — different subsection, same fact, present in both.
- Full per-course marks tables (`academics.years`) are website-only, as
  documented above — were never in any version of this PDF.

## Website brought into alignment with the PDF, same day (2026-08-26)

Follow-up to the sync audit above — user asked to actually apply several of
the PDF-only changes back to the website too, plus a site-wide dash-style
change:

- **CLI-driven ad-hoc testing removed from `site.js`'s Level 1 description**
  (was already gone from the PDF) — the sentence now ends at "...for release,
  all while continuing to deepen expertise in C#, .NET, and scalable backend
  development."
- **InkLink (`projects.js`) now matches the PDF's frontend-only framing**:
  `stack` trimmed from the full 9-item team stack down to `["React",
  "TypeScript", "WebSockets"]`; `summary` replaced with the same plain-English
  frontend description used in the PDF; `highlights` rewritten from 4
  backend-flavored bullets (hybrid storage split, server-side CRDT
  infrastructure, row-level sharing model, markdown editor) down to 3
  frontend-appropriate ones (markdown editor integration kept, plus two new
  ones about real-time UI updates and the sharing/permissions UI) — none of
  them claim backend/CRDT implementation. `role` field was already correct
  and untouched.
- **E-Spaza (`projects.js`) stack condensed to match the PDF**: `["React
  18", "TypeScript", "Apollo Client", "Apollo Server", "TypeGraphQL",
  "TypeORM", "PostgreSQL", "Auth0"]` → `["React", "TypeScript", "GraphQL",
  "TypeORM", "PostgreSQL", "Auth0"]`. `summary`/`highlights` were left as-is
  (richer prose, not inaccurate, no PDF equivalent to diff against beyond the
  one-liner).
- **Framer Motion removed from Propagen's stack, both website and PDF** — the
  user confirmed it isn't actually used in that project despite being listed;
  this wasn't a sync gap, it was wrong information on both sides. Removed
  from `projects.js`'s `propagen-website` entry and re-removed from the PDF
  (had just been re-added by the sync-audit fix immediately prior — that fix
  was itself wrong, corrected here).
- **Em-dashes replaced with plain hyphens site-wide, in every rendered
  string** (not in code comments — those keep em-dashes, they're not visible
  on the site): `site.js` (already partly done fixing the CLI-testing
  sentence), all of `projects.js` (67 lines — titles, summaries, highlights,
  every image caption, done via a one-off Python script that skipped `//`
  comment lines and replaced `—` → `-` on every other line), plus one
  rendered-copy line each in `WorkApp.astro` ("open any card for...") and
  `SkillsApp.astro` ("...workflows I work with -"). Verified via `grep` that
  every remaining `—` in `src/` is inside a `/* */` or `//` comment, not
  displayed text.

Verified all of this live in-browser: Propagen/InkLink/E-Spaza detail-dialog
stack tags read exactly as above, InkLink's summary/highlights match the PDF,
no content-related console errors (the only console errors seen were Astro's
dev-toolbar trying to reach its own local audit endpoint — a known dev-mode-
only artifact unrelated to any of these edits). Re-read the regenerated PDF
too: still 2 pages, ~97KB.

## Mentoring wording: "junior" removed, "first service build" kept (2026-08-27)

User asked to drop "junior developer" from the mentoring mentions (title/
seniority not something to assert without checking) but explicitly does
want the "through their first service build"/"through building their first
game service" detail kept — an over-correction on the first pass replaced
both with a fully generic "mentored another developer on the team", which
lost real information the user wanted retained. Corrected to keep the detail
and drop only "junior", everywhere it appears in `site.js` and the PDF:
- `about.summary` / PDF Summary: "...I've mentored a developer through their
  first service build, and I'm always looking for..."
- `experience[2].description` (Level 1 role) / PDF Level 1 bullet:
  "...Onboarded and mentored a developer through building their first game
  service. Built a Blazor-based..."
- `achievements.professional[1]` / PDF Accomplishments Professional bullet:
  "Mentored a developer through building their first game service"

The Criminal Record removal from the PDF's Personal Information block (see
below) is unaffected by this correction and still stands.

Verified: read the regenerated PDF (all three spots correct), and checked
the live website's About/Experience/Achievements windows via JS — all three
now contain "first service build" or "first game service" and none contain
"junior". No console errors. Still 2 pages, ~96.6KB.

## Criminal Record removed from PDF (2026-08-27)

Removed the "Criminal Record: None" line from the PDF's Personal Information
block per explicit request. That field has no website equivalent to begin
with (`about.facts` shows Location/Role/Focus, not personal details like
this — see the earlier "Personal Info" divergence note), so this is
PDF-only. Personal Information now reads just Age/Gender/Nationality.

## Website About summary made word-for-word identical to the PDF (2026-08-27)

`site.js`'s `about.summary` had drifted from the PDF's Summary wording
across earlier edits (different sentence order — "BSc..." as a trailing
fragment instead of woven into the opening clause, and a different closing
line: "next thing to build or learn" vs the PDF's "next problem worth
solving"). User asked for the website to match the PDF exactly, so
`about.summary` is now the identical string used in the PDF's Summary
section: "Software Developer at Games Global with a BSc in Computer Science
(Data Science) from Stellenbosch University, now putting that foundation to
work owning service development end-to-end - building .NET/C# game
backends, a Blazor-based simulation management and testing website, and an
AI-powered translation tool on AWS Bedrock that cut the team's localisation
costs. I've mentored a developer through their first service build, and I'm
always looking for the next problem worth solving." No PDF change needed —
the PDF was already the source of truth here. Verified via the live About
window's rendered text; no console errors.

## Contact app hint text corrected (2026-08-27)

`ContactApp.astro`'s hint under the Email CTA said "For LinkedIn and GitHub,
open the Contact Links icon in the dock" — stale copy from before
`contact.github` was left empty. Since `contact.github` is still `""` (see
the long-standing "Open items" note below — user hasn't supplied a GitHub
URL), the dock's Contact Links flyout only ever shows LinkedIn and Email,
never GitHub, so the hint was actively wrong. Changed to "For LinkedIn and
Email, open the Contact Links icon in the dock." Verified live — the
Contact window's hint paragraph now reads exactly that, no console errors.
If `contact.github` ever gets filled in, this line should go back to
mentioning GitHub too.

## Bug fix: closed lightbox rendering as a black box at the bottom of the Work app (2026-08-27)

User reported: maximizing the Portfolio window created a huge black box at
the bottom with a × in its top-right corner. Root cause: `WorkApp.astro`'s
`.lightbox` CSS rule (the fullscreen image-zoom `<dialog>` added a few
sessions ago) set `display: flex` unconditionally on the bare `.lightbox`
selector, not scoped to `.lightbox[open]`. A `<dialog>` with no `open`
attribute is `display: none` by default via the browser's UA stylesheet —
but **author CSS always wins over UA styles regardless of selector
specificity**, so that unconditional `display: flex` overrode the default
and rendered the closed dialog inline in the normal document flow at its
declared 100vw×100vh size, with its near-black background
(`rgba(8,9,11,0.97)`) and its `.lightbox-close` (×, positioned top:16px
right:16px) button visible — exactly the "black box with an × in the top
corner" reported. It became visually obvious specifically when the window
was large enough (maximized) to make the extra block-level space at the
bottom of `.work-app`'s content plainly visible.

Fixed by removing `display: flex` from the base `.lightbox` rule entirely,
leaving it only on `.lightbox[open]` (which already existed and was the
correct rule — the bug was the redundant unscoped copy above it). Verified
via computed styles: with the Portfolio window maximized and no project
open, `.lightbox` now reports `display: none` and a 0×0 `getBoundingClientRect()`;
opening a project and clicking the zoom button still correctly shows
`display: flex` and `dialog.open === true`. No console errors. This is the
kind of `<dialog>` gotcha worth remembering for any future dialog added to
this codebase — never put `display` on the bare selector, only on
`dialog[open]` or `dialog:modal`.

## Website project content trims across 5 projects (2026-08-27)

`projects.js` content edits, website only (no PDF changes requested/needed —
these projects aren't in the PDF's terser project list beyond title/stack):

- **Propagen Website**: removed the 2nd highlight ("Typed, layered error
  handling..."), kept the 1st (server-side proxy) and what's now the 2nd
  (scripted chat animation).
- **Real Estate Website**: `context` changed from "Client project, Propagen"
  to just "Client project" — dropped the Propagen name reference entirely,
  consistently (title was already "Real Estate Website" from an earlier
  session, not "Bar Valley Properties"). `summary` no longer says "for
  Propagen, an n8n-based automation agency" or "re-skinned and re-pointed at
  a new Airtable base for each future client" — now says "built as a
  reusable client template, with per-client theming driven by environment
  variables." `role` no longer ends with "...and the local-dev tooling."
  Last highlight (the custom Vite plugin / local-dev-without-Vercel-CLI one)
  removed, down to 3 highlights.
- **InkLink**: `role` field ("Frontend - one of three frontend devs on a
  6-person team.") removed entirely (user's explicit choice — asked, offered
  a "replacement text" alternative, user chose flat removal). `WorkApp.astro`
  already handles a missing `role` gracefully (conditional render +
  `:empty { display: none }`), same as most other projects that never had
  one — no component change needed.
- **Gomoku**: removed "Connects to a game server over a socket and plays
  live matches." from the summary — summary now ends at "...idle workers."
- **DFA-Based Image Compression**: removed the "Self-similar images
  compress to a handful of states..." sentence from the summary (now just
  the first sentence), and removed the last highlight (the regression-style
  test harness one), down to 3 highlights.

Verified all 5 live via the Work app's project-detail dialog (summary/role/
context/highlights read exactly as above for each), no console errors.

## PII acronym spelled out (2026-08-27)

Real Estate Website's "PII stripping at the API boundary..." highlight now
reads "PII (personally identifiable information) stripping..." — spells the
acronym out on first use so it doesn't assume the reader already knows it.
Verified live via the project-detail dialog; no console errors.

## Bug fix: solid cream block at the bottom of tall windows (2026-08-27)

User reported: resizing a window past a certain height turned the bottom
section into a single solid off-white/cream block. Root cause: `.window`
is a flex column (titlebar + `.window-body`), but `.window-body` had no
`flex: 1` — so it only ever grew to fit its own content's natural height,
never to fill the window. Resize a window taller than its content needs and
the leftover space below `.window-body` just showed `.window`'s own
background (`rgba(246, 244, 240, 0.88)`, an off-white/cream glass tint)
instead of `.window-body`'s lighter one (`rgba(255, 255, 255, 0.35)`) — a
plain, texture-less block exactly matching what was reported. Confirmed by
measuring: before the fix, resizing a Contact window (short content) to
933px tall left `.window-body` at only ~243px, with a ~485px gap of bare
`.window` background below it.

Fixed by adding `flex: 1; min-height: 0;` to `.window-body` in
`desktop.css`. The `min-height: 0` is required alongside `flex: 1` — without
it a flex child's default `min-height: auto` lets its content's natural
height override `overflow-y: auto` and force the flex item (and so the
window) to grow to fit the content instead of scrolling internally.

Verified: (1) `.window-body` now correctly grows to ~900px when a Contact
window is resized to 933px tall — no more gap/solid block; (2) an
Achievements window (which has genuinely tall content — the marks tables)
still scrolls correctly inside a small window instead of forcing the window
to grow (`scrollHeight` 3036px clipped to `clientHeight` 527px, `overflow-y:
auto` confirmed); (3) on a mobile viewport, `.window-body` now also
correctly fills the forced near-fullscreen mobile window height — which
incidentally **resolves the previously-documented mobile-empty-space open
item below** (see the "Open items" section — that note is now stale, kept
only as history until this section gets trimmed). No console errors.

## Mobile overflow fixes: Contact CTA + Portfolio cards (2026-08-27)

User reported the Contact email button looked off-center on mobile ("padding
on the left"), asked whether portfolio cards were centered on mobile too,
and asked whether mobile always opens a window fully. Answered the last one
directly first: yes — `sizeForMobile()` in `DesktopScript.astro` always sets
every window to `calc(100vw - 88px)` × `calc(100vh - 84px)` on mobile,
regardless of app or content, unconditionally.

Investigating the first two found a real, shared root cause: mobile windows
are much narrower (`calc(100vw - 88px)` ≈ 287px at a 375px viewport, ~240px
after `.window-body` padding) than either component assumed:

- **Contact CTA**: the button's own content ("Email <address>") doesn't fit
  that width on one line and nothing constrained it, so it overflowed the
  window's right edge and got clipped by `.window`'s `overflow: hidden` —
  visible only from the left, reading as "left-padded" / off-center.
- **Portfolio cards**: `.grid-2` (global.css) is `repeat(auto-fit,
  minmax(280px, 1fr))` — a 280px floor wider than the ~240px actually
  available, so cards overflowed and got clipped the same way, for the same
  reason.

**Portfolio fix**: added a `@media (max-width: 900px), (pointer: coarse)`
override in `WorkApp.astro` collapsing `.project-grid` to
`grid-template-columns: 1fr` — a single unconstrained column always exactly
fits whatever width is actually available, no floor to overflow. (This
media query matches the codebase's existing mobile breakpoint, already used
elsewhere in `desktop.css`.)

**Contact CTA fix** took two attempts — worth recording why the first one
failed:
1. First attempt: wrapped the email text in a new `.contact-cta-label` span
   with `min-width: 0` (needed for a flex item's content to actually
   shrink/wrap instead of defaulting to its unwrapped max-content size), and
   tried centering `.contact-cta-wrap` on mobile via `display: table;
   margin: auto`. This did NOT work — table auto-layout treats a table's
   unwrapped content width as a hard floor and ignores `max-width` rather
   than reflow/wrap cell content, so the button never actually shrank
   (confirmed by measuring: identical 278px width before and after, despite
   `max-width: 100%` computing correctly in devtools).
2. Fix: switched `.contact-cta-wrap`'s mobile display to `display: flex;
   justify-content: center` instead of `table` — flex containers have no
   such floor. Also had to move `.contact-cta-glow` (the pulsing radial
   highlight) from being a sibling of `.contact-cta` positioned relative to
   `.contact-cta-wrap`, to being a child of `.contact-cta` positioned
   relative to `.contact-cta` itself — otherwise, once the wrap became a
   full-width flex row, the glow's `inset: -10px` would have covered the
   entire row instead of hugging just the button.

Verified thoroughly at 375px: button width now 239.8px (down from the
overflowing 267–278px), wraps onto 2 lines (height 72px → 97px), zero
overflow past the window's right edge, and precisely centered (17.85px gap
on both sides, confirmed equal). Portfolio card: same 239.8px width, same
symmetric 17.85px gaps, zero overflow. Re-verified at 1280px desktop width
that neither change altered anything — `.contact-cta-wrap` still
`inline-block`, button still single-line, left-aligned as before (the media
query correctly doesn't fire). No console errors either way.

## Mobile overflow audit across all other apps (2026-08-27)

Follow-up to the Contact/Portfolio mobile-overflow fixes above — user asked
to check every other app for the same issue. Swept all 7 windows
(About/Skills/Portfolio/Experience/Achievements/Resume/Contact) at 375px by
opening each and measuring every descendant element's `getBoundingClientRect()`
against the window's right edge. Result: only Achievements' university marks
`<table>` "overflows" its window — and that's correct, intentional behavior,
not a bug: `.table-scroll` has `overflow-x: auto` and its own box stays
fully within the window (`scrollOverflowsWindow: false`, confirmed
separately), it's only the un-scrolled table *content* that's wider, which
is exactly what a horizontally-scrollable table is supposed to do. No other
app has a fixed-width/minmax-floor element like the two that were fixed
(About's `.about-facts` grid has a 150px minmax floor, comfortably under the
~240px available; Skills' tile grid is `flex-wrap`, not a rigid grid;
Experience's `20px 1fr` grid column is trivially small). Nothing else to fix
here.

## Dead code cleanup (2026-08-27)

User asked for a pass through the codebase removing unused code. Found and
removed, all confirmed unused via `grep` across `src/` before deletion:

- **`navItems`** export in `site.js` — a `#about`/`#skills`/etc. hash-anchor
  nav list, leftover from an earlier single-page-scroll version of the site
  from before the macOS-desktop-window redesign. Never imported anywhere
  (navigation is entirely via the dock/menu bar now).
- **`global.css`**: `.container`, `.section`, `.section-tight`,
  `.btn-primary`, `.btn-outline`, and the `hr { ... }` rule — all leftover
  from that same pre-redesign, full-page-scroll layout (`.container`'s
  centered-max-width column, `.section`'s big vertical page-section padding,
  outlined/primary button variants, a `<hr>` divider style) with zero
  matching elements anywhere in the current template-driven, desktop-window
  UI. `.card`, `.btn`, `.btn:hover`, `.chip`, `.grid`, `.grid-2`, `table`/
  `th`/`td` (all still actively used — the AchievementsApp marks tables use
  real `<table>` elements) were left untouched.
- **CSS custom properties**: `--max-width` (only consumer was the now-removed
  `.container`), `--primary-contrast` (only consumer was the now-removed
  `.btn-primary`), and `--secondary` (never referenced via `var(--secondary)`
  anywhere) — all deleted from `:root` in `global.css`.

Checked and found genuinely clean (no action needed): every function
declared in `DesktopScript.astro` and `WorkApp.astro`'s scripts has at least
one real call-site (verified by counting `fnName(` occurrences per function,
then double-checking the one false-negative by eye — `openLightbox` is
passed by reference to `addEventListener`, not called with `()`, so the
naive grep undercounted it; it's genuinely used). `package.json` has no
stray dependencies (already cleaned earlier — see the sharp/pdf-lib one-off
tool notes above). Every file under `public/Projects/` is referenced by
`projects.js` (verified by diffing the two file lists); `Photos/pfp.jpg` and
`Photos/wallpaper-hills.jpg` are both referenced (`AboutApp.astro`,
`Wallpaper.astro`); `favicon.svg` is referenced (`Layout.astro`).

**Deliberately NOT removed, despite being currently unused** — don't treat
these as dead code without checking first:
- `repo` field on every `projects.js` entry (unused since the "View
  repository" button was removed from `WorkApp.astro` — see that earlier
  note) — kept because it's real per-project data the user may want back on
  the cards later, not code cruft.
- `linkGlyphs.github` SVG in `Dock.astro` and `contact.github` in `site.js`
  (currently `""`) — the Contact Links flyout already filters it out
  automatically since it's falsy; the moment the user supplies a real GitHub
  URL it activates with zero code changes needed. Removing the glyph now
  would mean re-adding it later.

Verified after all removals: dev server starts clean, every app window opens
with no console errors, and `.card`/`.btn` (both still-used global classes)
compute their styles correctly (`border-radius` still resolving from
`var(--radius)`, `.card` background/border unaffected) — confirming the
`--max-width`/`--primary-contrast`/`--secondary` variable removals didn't
silently break anything still relying on them.

## Dead code cleanup, round 2 — systematic scan (2026-08-27)

Follow-up "please continue" — did a deeper, script-driven pass rather than
more manual spot-checks:
1. For every `.astro` component, extracted every class selector from its own
   `<style>` block and confirmed each one appears elsewhere in that same
   file (template or script). Zero unused — the codebase's scoped CSS is
   already clean.
2. Same check for `desktop.css` and `global.css` against the *entire*
   `src/` tree (not just one file). `global.css` came back clean (post the
   round-1 removals above). `desktop.css` turned up one real one:
   **`.spotlight-result.highlighted`** — a keyboard-navigation highlight
   style with zero JS ever toggling it (confirmed via grep for
   `ArrowUp`/`ArrowDown`/`highlighted` across `DesktopScript.astro` — none
   exist; Spotlight has no arrow-key result navigation implemented at all).
   Removed just the `.highlighted` part of that compound selector, keeping
   `.spotlight-result:hover` (which is real and used).
3. Counted identifier occurrences for every `const` declared in the three
   largest script blocks (`WorkApp.astro`, `DesktopScript.astro`,
   `AchievementsApp.astro`) — zero declared-but-unused variables.
4. Sanity-checked `astro.config.mjs` — minimal, nothing to trim.

Verified: reopened Spotlight after the `.highlighted` removal — overlay
still opens, all 7 results still list correctly, no console errors.

## GitHub Contact Links plumbing + `repo` fields removed (2026-08-27)

User revisited the "deliberately left alone" call from the dead-code cleanup
above and said to remove it — they'll re-add if/when needed rather than
leave it dormant. Removed:
- `repo: "..."` from `projects.js`'s two entries that had it
  (`propagen-website`, `propagen-client-website-template`) — and the now-
  pointless plumbing that only existed to carry that field through:
  `repo: p.repo ?? ""` in `WorkApp.astro`'s `clientProjects` mapping, and
  `repo: string;` from its `Project` TypeScript type.
- `linkGlyphs.github` (the GitHub SVG path data) and the `{ key: "github",
  ... }` entry from `contactLinks` in `Dock.astro`.
- `contact.github: ""` (plus its explanatory `// TODO` comment) from
  `site.js`.

Verified live: Contact Links flyout now lists exactly `["LinkedIn",
"Email"]`; a project dialog still opens correctly (no crash from the
removed field); no console errors.

## Refactor pass: simplifying over-complex code (2026-08-27)

Different framing from the dead-code passes above — not "is this reachable"
but "is this more complicated than it needs to be." Found and fixed two real
ones:

1. **Window drag + resize-handle duplication in `DesktopScript.astro`**. The
   titlebar-drag handler and each of the 8 per-window resize-handle handlers
   independently reimplemented the same "track the pointer from mousedown to
   mouseup" pattern — each with its own boolean flag (`dragging`/`resizing`)
   and its own **permanently-attached** `window`-level `mousemove`/`mouseup`
   listener pair that just early-returned when idle. At 8 handles × every
   window that exists, that's dozens of always-on listeners across the whole
   page doing a checked no-op on every mouse movement anywhere, just so a
   drag *could* start. Extracted a shared `trackPointer(onMove, onUp)`
   helper that attaches the mousemove/mouseup pair only for the duration of
   one actual drag gesture (added on mousedown, removed on mouseup) — both
   call sites shrink to just their drag-specific math, the boolean flags are
   gone entirely (unnecessary once listeners only exist while a drag is
   genuinely in progress), and idle listener count drops from "8 permanent
   pairs per window" to zero.
2. **Duplicated + actually-buggy carousel/lightbox nav in `WorkApp.astro`**.
   `prevBtn`/`nextBtn` (carousel) and `lightboxPrev`/`lightboxNext`
   (fullscreen zoom) each reimplemented the same index-wrapping arithmetic.
   Worse: `lightboxPrev`/`lightboxNext` called `renderImage()` *and then*
   explicitly called `renderLightbox()` again — but `renderImage()` already
   calls `renderLightbox()` itself whenever the lightbox is open (`if
   (lightbox?.open) renderLightbox()`), which it always is when those two
   buttons are even clickable. That's a genuine double-render on every
   lightbox nav click, not just a style nitpick. Consolidated all four
   into one `stepIndex(delta)` helper; each button is now a one-line
   `addEventListener("click", () => stepIndex(±1))`.

Verified both thoroughly in-browser (not just "it still looks right"):
- Drag: synthetic mousedown→mousemove→mouseup on a titlebar moved the window
  by exactly the delta dragged; a stray `mousemove` with no preceding
  `mousedown` now has zero effect (previously would have too, since
  `dragging` would be false, but this confirms no listener leaked); dragging
  a second window immediately after moved only that window, not the first.
- Resize: a corner-handle drag grew the window by the expected delta.
- Maximize interactions: maximizing then dragging the titlebar correctly
  un-maximizes first (restores the pre-maximize size, 652.8×528 in the test)
  and then follows the cursor; maximizing then dragging a resize handle also
  correctly un-maximizes.
- Carousel/lightbox sync: stepping next/prev from the carousel and from the
  lightbox both update the *other* view's caption identically at every step,
  confirming the shared `stepIndex()` didn't break the two-way sync (or
  reintroduce the double-render — no visible difference expected there, but
  the redundant call is simply gone from the code now).
- No console errors in either case.

## Achievements table horizontal scroll: verified working (2026-08-27)

User asked to double-check the university marks table's horizontal scroll,
suspecting they might just be misclicking it. Confirmed it genuinely works:
- At the default desktop window size the table (420px min-width) fits
  entirely within the card, so there's nothing to scroll — not a bug, just
  no overflow to speak of at that size.
- At mobile width the table (403px rendered) is genuinely wider than its
  `.table-scroll` box (191.8px) — real overflow exists.
- A synthetic `WheelEvent`/the automation tool's `scroll` action did NOT
  move `scrollLeft` — but a synthetic drag gesture (`left_click_drag`) did,
  moving `scrollLeft` from 0 to 220. Setting `scrollLeft` directly also
  works. So the element is genuinely, natively scrollable; only synthetic
  wheel-style scroll events don't translate to it in this sandboxed pane —
  a real touch swipe (which is how an actual mobile visitor would scroll it)
  works fine.

**Real, separate finding while investigating**: there's no visual cue that
the table is scrollable at all — no visible scrollbar, no edge fade/shadow,
and the outer `.university-card` extends noticeably wider than the actual
scrollable `.table-scroll` region (249.8px vs 199.8px in one measurement),
so it looks like a plain, complete card with nothing further to reveal. This
is likely the real reason it read as "not working" — not a functional bug,
a missing affordance. Flagged to the user rather than changed unprompted;
a small addition (visible scrollbar styling, or an edge-fade/"swipe" hint)
would fix the discoverability without touching the actual scroll mechanism.

## Bug fix: Contact Links flyout unreachable on mobile/touch (2026-08-27)

User reported the Contact Links dock icon does nothing on mobile, whether
hovering (impossible — no hover on touch) or tapping (confirmed doing
nothing: `.dock-flyout` opacity stayed 0, no class change). Root cause:
an earlier session change removed the trigger's click handler entirely,
leaving `.hover-open` (mouse-only) and `:focus-within` (keyboard-only) as
the only ways to open the flyout — both unreachable by touch, so the
feature was completely inaccessible on mobile, not just less convenient.

Fixed by re-adding a click handler, gated specifically to
`window.matchMedia("(hover: none)").matches` — so it only exists on devices
that have no other way to open the flyout; desktop mice keep the exact
"click does nothing, hover-to-open" behavior from before. Also re-added
(removed in that same earlier session, now needed again since touch can set
`.open`): the `.dock-item-links.open` case in `desktop.css`'s "show flyout"
selector (both the base rule and its mobile-media-query duplicate), an
outside-tap-to-close `document` click listener (touch has no `mouseleave`
to auto-close it the way desktop hover does), and `.open` cleanup in the
Escape-key handler alongside the existing `.hover-open` cleanup.

**Verification note — a real debugging detour worth recording**: initial
`getComputedStyle(flyout).opacity` reads stayed `"0"` even after confirming
via `element.matches()`, raw CSS source inspection, and specificity analysis
that the `opacity: 1` rule was correct and should apply. This turned out to
be the same sandboxed-pane limitation documented earlier in this file for
IntersectionObserver/rAF — **animated/transitioning properties never
resolve past their initial value here because this pane never composites
frames**, while non-animated properties on the same element (`pointer-events`,
which has no transition) update and read correctly immediately (confirmed:
read `"auto"` right after opening). Verification therefore used
`pointer-events` and class-list state instead of the (here-unreliable)
`opacity` read: `.open` toggling on/off across click/second-click/outside-tap/
Escape, and `pointer-events` flipping `none → auto`, all confirmed working
via a full sequence test.

**Also hit a stale-HMR console error mid-investigation** — same class of
transient issue as the earlier HelpOverlay-deletion note: after several
rapid edits, the *existing* tab logged `SyntaxError: Identifier 'trigger'
has already been declared` (classic, non-module `<script>` tags share one
top-level lexical scope across the whole document, so if Vite's dev-server
HMR injects a replacement script without fully discarding the previous one,
duplicate top-level `const`s across the two collide). Confirmed harmless:
a **brand new tab** (not just a reload of the same tab) loaded with zero
console errors and all behavior working correctly. Not a real code bug —
don't chase this class of error without first trying a fresh tab, per the
existing HelpOverlay note.

## Open items / things the user may still ask for
- Chatbot (AI terminal like the reference theme has) — explicitly deferred by the
  user as a "maybe later" feature. Do not add Groq/Supabase/any backend for it
  without the user asking again; it changes hosting requirements (would need to
  move off pure static GitHub Pages).
- Icon styling stays original artwork "inspired by" macOS app genres, not sourced
  from Apple's real icons — keep it that way if iterating further. The wallpaper
  is no longer original SVG art; it's now a real, freely-licensed Unsplash photo
  (see "Wallpaper: Bliss-style photo" above) — that's a deliberate exception the
  user asked for, not a lapse in the "no external assets" rule.
- ~~Mobile windows currently force near-fullscreen height (`sizeForMobile()`)
  even for short-content apps like Contact, leaving visible empty space below
  the content.~~ **Resolved as a side effect of the `.window-body { flex: 1 }`
  fix above (2026-08-27)** — the window still forces near-fullscreen height on
  mobile (unchanged, still `sizeForMobile()`), but `.window-body` now actually
  fills that height with its own background/content area instead of leaving a
  visible gap of `.window`'s bare background below short content. The
  "near-fullscreen even for short content" sizing itself is still there by
  design; only the visual gap it used to leave is gone.
- `contact.github` is still an empty string in `site.js` — user still needs to
  supply their actual GitHub profile URL for the Contact Links dock flyout to
  show it. `contact.phone`/Call were removed outright (2026-08-18), not just
  left empty — don't re-add a phone field unless the user asks again.
