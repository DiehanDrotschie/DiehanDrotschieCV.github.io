const icon = (paths, viewBox = "0 0 24 24") =>
    `<svg viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

// Icon glyphs below are original artwork drawn to *evoke* the kind of macOS
// app each window plays the role of (Contacts, Terminal, Photos, Calendar,
// Game Center, Pages, Mail, an address-book flyout) — not traced or copied
// from Apple's actual (trademarked) app icons. Same "inspired by, not sourced
// from" boundary this repo already holds for the wallpaper — see CLAUDE.md.
export const apps = [
    {
        id: "about",
        title: "About Me",
        gradient: "linear-gradient(160deg, #6fb3ff 0%, #2f6bd6 100%)",
        // Contacts-style ID card: rounded card, portrait circle, shoulders.
        icon: icon(
            '<rect x="4" y="3" width="16" height="18" rx="2.5"/><circle cx="12" cy="10" r="3"/><path d="M7.3 17c1-2.1 2.9-3.2 4.7-3.2s3.7 1.1 4.7 3.2"/>',
        ),
        width: 620,
        height: 520,
        openOnLoad: true,
    },
    {
        id: "skills",
        title: "Skills",
        gradient: "linear-gradient(160deg, #3a3f4a 0%, #15171c 100%)",
        // Terminal-style window: chevron prompt + blinking-cursor line.
        icon: icon(
            '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m7 9 4 3-4 3"/><path d="M13 15h4"/>',
        ),
        width: 520,
        height: 340,
    },
    {
        id: "work",
        title: "Portfolio",
        gradient: "linear-gradient(160deg, #6fd0ff 0%, #1f8fe0 100%)",
        // Photos-style frame: sun + mountain skyline.
        icon: icon(
            '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m4 17 4.5-5 3 3 3.5-4.5L21 17"/>',
        ),
        width: 680,
        height: 560,
    },
    {
        id: "experience",
        title: "Experience",
        gradient: "linear-gradient(160deg, #ffb266 0%, #ff7a1a 100%)",
        // Calendar-style grid: binder rings on top, a grid of date dots below.
        icon: icon(
            '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>',
        ),
        width: 600,
        height: 520,
    },
    {
        id: "achievements",
        title: "Achievements",
        gradient: "linear-gradient(160deg, #ffe066 0%, #f2a900 100%)",
        // Game Center-style medal: ribboned rosette with a star at its center.
        icon: icon(
            '<circle cx="12" cy="8" r="6"/><path d="M8.2 13.8 7 22l5-3 5 3-1.2-8.2"/><path d="M12 5 13 7.3h2.4l-1.9 1.5.7 2.4-2.2-1.5-2.2 1.5.7-2.4-1.9-1.5H11Z"/>',
        ),
        width: 680,
        height: 560,
    },
    {
        id: "resume",
        title: "Resume",
        gradient: "linear-gradient(160deg, #ff8a80 0%, #e0311a 100%)",
        // Pages-style document: folded corner + text lines.
        icon: icon(
            '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8"/><path d="M8 17h5"/>',
        ),
        width: 760,
        height: 760,
    },
    {
        id: "contact",
        title: "Contact",
        gradient: "linear-gradient(160deg, #6fe0a0 0%, #1fa35f 100%)",
        // Mail-style envelope.
        icon: icon('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>'),
        width: 520,
        height: 300,
    },
    {
        id: "contact-links",
        title: "Contact Links",
        gradient: "linear-gradient(160deg, #c9a6ff 0%, #7b4fe0 100%)",
        // Address-book-style flyout trigger: spine tabs + entry lines.
        icon: icon(
            '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h2"/><path d="M4 13h2"/><path d="M4 18h2"/><path d="M9 8h7"/><path d="M9 13h7"/><path d="M9 18h5"/>',
        ),
        // Desktop: dock-only hover flyout, not a window — see Dock.astro.
        // Mobile: opens as a real window (ContactLinksApp.astro) instead,
        // since touch has no hover to trigger the flyout with — see
        // DesktopScript.astro's `.dock-item-links` handling. `links: true`
        // still marks this as excluded from the menu bar / Spotlight, which
        // stay desktop-flyout-only.
        links: true,
        width: 420,
        height: 340,
    },
];
