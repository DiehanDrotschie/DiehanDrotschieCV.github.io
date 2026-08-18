# Wedding Table Allocation

**Stack:** Vanilla HTML/CSS/JavaScript — no framework, no backend

## Summary

A small single-purpose site built for a real wedding: guests enter their name and surname, and the site looks them up against a guest list to reveal their assigned table number with a card-flip animation. Built and hosted with zero backend infrastructure — the guest list lives as a JSON file in the same GitHub repo as the site and is fetched directly from GitHub's raw content CDN at request time.

## How it works

- The guest list (`Guests.json`) is a flat array of records — name, surname, an optional "date" (plus-one) name/surname pair, and a table number.
- On lookup, the site does a case-insensitive match against either the guest's own name/surname *or* their date's name/surname — so either half of a couple can look themselves up and get the same table.
- A match triggers a CSS 3D transform (`rotateY(180deg)` on a `.flip-card-inner`) to flip the card over and reveal the table number, rather than navigating to a new page or swapping DOM content abruptly.
- No match shows a plain validation alert; the "Back" action resets the form and flips the card back.

## Technical highlights

- **Zero-infrastructure data source**: the guest list is fetched client-side directly from `raw.githubusercontent.com` — updating the guest list is a `git push`, with no database, API, or server to deploy or maintain for what is fundamentally a one-event, short-lived site.
- **Fully JS-driven responsive sizing**: rather than CSS media queries, `adjustElementSizes()` computes font sizes and element dimensions from `window.innerWidth`/`innerHeight` on load and on resize — a deliberate (if unconventional) choice that scales continuously with viewport size instead of snapping between fixed breakpoints.
- **Two-sided guest matching**: looking a person up by either their own name or their named plus-one's name reflects a real requirement (not every guest RSVP'd under their own name) rather than assuming a 1:1 guest-to-record mapping.

## Screenshots

| File | Shows |
| --- | --- |
| `01-wedding1.jpg` | Lookup form — enter name and surname |
| `02-wedding2.jpg` | Result view after the card flips — guest name(s) and assigned table number |
