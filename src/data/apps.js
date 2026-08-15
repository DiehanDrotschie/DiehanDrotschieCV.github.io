const icon = (paths) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

export const apps = [
    {
        id: "about",
        title: "About Me",
        icon: icon('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>'),
        width: 620,
        height: 520,
        openOnLoad: true,
    },
    {
        id: "skills",
        title: "Skills",
        icon: icon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
        width: 520,
        height: 340,
    },
    {
        id: "work",
        title: "Portfolio",
        icon: icon('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),
        width: 680,
        height: 560,
    },
    {
        id: "experience",
        title: "Experience",
        icon: icon('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
        width: 600,
        height: 520,
    },
    {
        id: "achievements",
        title: "Achievements",
        icon: icon('<circle cx="12" cy="8" r="6"/><path d="M8.2 13.8 7 22l5-3 5 3-1.2-8.2"/>'),
        width: 680,
        height: 560,
    },
    {
        id: "resume",
        title: "Resume",
        icon: icon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>'),
        width: 640,
        height: 600,
    },
    {
        id: "contact",
        title: "Contact",
        icon: icon('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>'),
        width: 520,
        height: 300,
    },
];
