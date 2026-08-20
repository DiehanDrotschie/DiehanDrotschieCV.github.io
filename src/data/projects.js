// Curated from the write-ups in `ProjectsScreenshotsAndInfo/<slug>/content.md`,
// which stay the canonical, full-detail source (course context, architecture
// notes, how screenshots were captured, etc). This file is the trimmed,
// CV-facing version shown in the Work app: stack, role, a summary, and the
// 3-4 most technically substantive highlights per project — not a full dump
// of the write-up. Screenshots live in `public/Projects/<slug>/` (copied
// from the source folder, which itself isn't served by Astro).
export const projects = [
    {
        slug: "propagen-website",
        title: "Propagen Website",
        context: "Personal project",
        stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Framer Motion"],
        repo: "https://github.com/DiehanDrotschie/propagen-website",
        summary:
            "A marketing site built with Next.js 16's App Router: homepage, pricing/comparison page, a product showcase page, and a multi-step lead-capture booking flow with a server-side form-submission API.",
        highlights: [
            "Server-side proxy for the form submission endpoint — the booking form posts to this site's own /api/book route, which validates fields server-side before forwarding to an external webhook read from a non-public env var, so the real endpoint URL never reaches client-side JS.",
            "Typed, layered error handling in the API route — distinguishes a malformed request (400), missing server config (500), and a failed upstream call (502) instead of one generic error response.",
            "A scripted chat animation built as an explicit state machine (not CSS) — turn-by-turn conversation with typing-indicator delays via setTimeout chains tracked in refs for clean cancellation on unmount, with a prefers-reduced-motion fallback.",
        ],
        images: [
            { file: "01-home-hero.png", caption: "Homepage hero" },
            { file: "02-home-full.png", caption: "Full homepage — problem, product, how-it-works, case study, FAQ, CTA" },
            { file: "03-pricing.png", caption: "Pricing page — two-tier cards, feature comparison table, onboarding timeline" },
            { file: "04-showcase.png", caption: "Showcase page — theme previews and full page-by-page product walkthrough" },
            { file: "04b-showcase-conversation.png", caption: "Showcase page — the auto-playing chat conversation simulation, mid-playback" },
            { file: "05-book.png", caption: "Multi-step lead-capture form, step 1 of 3" },
            { file: "06-mobile-home.png", caption: "Mobile viewport (390px) — responsive homepage hero" },
        ],
    },
    {
        slug: "propagen-client-website-template",
        title: "Bar Valley Properties — Real Estate Website",
        context: "Client project, Propagen",
        stack: ["React 19", "Vite 7", "Tailwind CSS 4", "Airtable", "Vercel Serverless Functions"],
        role: "Designed and built the frontend and the serverless API layer end-to-end — component architecture, Airtable data-fetching/caching, Vercel functions and their security posture, and the local-dev tooling.",
        repo: "https://github.com/DiehanDrotschie/propagen-client-website-template",
        summary:
            "A production-ready real estate listings site built as a reusable client template for Propagen, an n8n-based automation agency. All property and agent data is pulled live from Airtable — no traditional database — and the site is designed to be re-skinned and re-pointed at a new Airtable base for each future client.",
        highlights: [
            "Airtable API key never reaches the browser — all Airtable calls go through Vercel serverless functions that hold the credential server-side and proxy sanitized JSON to the client.",
            "PII stripping at the API boundary — internal-only fields (agent record links, owner name/email/phone) are explicitly stripped before a response ever leaves the server.",
            "Rate limiting on public API routes via @vercel/firewall with an explicit fail-open policy, plus security headers (CSP-adjacent, X-Frame-Options, HSTS) configured at the Vercel edge.",
            "Local dev without the Vercel CLI — a custom Vite plugin reimplements enough of the Vercel serverless request/response contract to run the same /api/* handlers directly inside vite dev.",
        ],
        images: [
            { file: "01-home-hero.png", caption: "Homepage hero with the property search bar" },
            { file: "02-home-full.png", caption: "Full homepage — featured listings, rentals, stats bar, category browse, CTA" },
            { file: "03-listings.png", caption: "Listings page — live Airtable data, sale/rent toggle, filters" },
            { file: "04-listings-rent.png", caption: "Listings page filtered to rentals" },
            { file: "05-about.png", caption: "About page — agency story and live team from Airtable" },
            { file: "06-contact.png", caption: "Contact page" },
            { file: "07-property-detail.png", caption: "Full property detail page — carousel, pricing, financials, WhatsApp enquiry" },
            { file: "08-mobile-home.png", caption: "Mobile viewport (390px) — responsive layout" },
        ],
    },
    {
        slug: "cs344-espaza-shop",
        title: "E-Spaza — Multi-Shop Ordering Platform",
        context: "Team project",
        stack: ["React 18", "TypeScript", "Apollo Client", "Apollo Server", "TypeGraphQL", "TypeORM", "PostgreSQL", "Auth0"],
        summary:
            "Digitizes South African spaza shops: customers browse and order stock from multiple nearby shops in one session, shop owners manage inventory (including camera-based barcode scanning) and fulfil orders, and a multi-shop route suggestion feature proposes an efficient collection route when an order spans several shops. Run as Scrum sprints with sprint-specific technical documents, retros, and a CI/CD pipeline.",
        highlights: [
            "Code-first GraphQL schema derived from the same TypeORM entity classes used for persistence, cutting out an entire layer of schema/type duplication between the ORM and the API.",
            "Relational schema for a real multi-shop marketplace — explicit join entities model that one order can span multiple shops and one user can hold different roles at different shops.",
            "Multi-stop route optimization via the HERE Maps API — aggregates a shopper's cart across shops into one suggested collection route, not just a single origin→destination lookup.",
            "Real device hardware in the browser — the inventory scanning flow uses getUserMedia for a live camera feed integrated with barcode-scanning libraries, not just a file-upload fallback.",
        ],
        images: [
            { file: "01-login.png", caption: "Login page — email/password and Google (Auth0) sign-in" },
            { file: "02-register.png", caption: "Registration page" },
            { file: "03-cart.png", caption: "Cart / order summary view" },
            { file: "04-app-shell.png", caption: "The authenticated app shell — sidebar navigation and top nav" },
            { file: "05-home-placeholder-data.png", caption: "Home page — categories sidebar, search/filter banner, item grid with add-to-cart" },
            { file: "06-dashboard-admin.png", caption: "Admin dashboard — order list and a live notifications feed" },
            { file: "07-inventory-stock.png", caption: "Inventory/stock management — item table, edit/delete, export to PDF" },
            { file: "08-specific-order.png", caption: "A single order's detail view — line items, fulfilment actions, suggested-route map" },
        ],
    },
    {
        slug: "cs343-inklink",
        title: "InkLink — Collaborative Markdown Notes",
        context: "Team project",
        stack: ["React 18", "TypeScript", "Vite", "Express", "Sequelize", "PostgreSQL", "WebSockets", "Yjs", "JWT"],
        role: "Frontend — one of three frontend devs on a 6-person team.",
        summary:
            "A collaborative note-taking app: users write and format notes in markdown with a live preview, share notes at different permission levels, and edit the same note simultaneously with changes propagating over a WebSocket connection. Built with an explicit Controller→Service→Repository backend architecture.",
        highlights: [
            "Hybrid storage split — note metadata lives in Postgres via Sequelize; note content is stored as a markdown file uploaded to Cloudinary, with only the resulting URL kept in the metadata row.",
            "Real-time collaboration over WebSockets, with Yjs/y-websocket CRDT infrastructure server-side for conflict-free merging of concurrent edits alongside a simpler content-broadcast path.",
            "Row-level sharing model — a separate NoteAccess join table (note, user, access-granter, access type) decouples who owns a note from who can see or edit it.",
            "Markdown editor integration — EasyMDE wired into React via refs with a custom marked-based preview renderer, plus a global note-state React Context to avoid prop-drilling across the sidebar and editor.",
        ],
        images: [
            { file: "01-login.png", caption: "Login page" },
            { file: "02-register.png", caption: "Register page — animated panel-swap transition from login" },
            { file: "03-note-editor.png", caption: "The markdown editor — toolbar, live-rendered preview, category selector, invite/collaborator UI" },
            { file: "04-home-placeholder-data.png", caption: "\"All Notes\" home page — card grid with thumbnails, sort/filter, pagination" },
            { file: "05-profile-placeholder-data.png", caption: "Profile page — avatar, role, account details" },
        ],
    },
    {
        slug: "instagram-clone",
        title: "Instagram Clone",
        context: "Personal project",
        stack: ["Dart", "Flutter", "Firebase"],
        summary:
            "A functional Instagram clone covering the core social-app loop end to end: account creation, an authenticated home feed, posting photos from the camera or gallery, liking and commenting, following/unfollowing, live user search, and a personal profile grid.",
        highlights: [
            "Firebase as the full backend — Auth for identity, Firestore for posts/comments/follow relationships/likes, and Storage for uploaded photos, with no custom server.",
            "Real-time data via Firestore snapshot listeners rather than one-off REST calls — follower/following/post counts and the feed reflect live state.",
            "Native device integration — the post-creation flow uses the device camera directly through Flutter's platform channels, not just a file picker.",
            "Denormalized social graph — following/follower relationships modelled with a document/collection structure chosen to keep read costs reasonable as the graph grows.",
        ],
        images: [
            { file: "01-login.jpg", caption: "Login screen" },
            { file: "02-signup.jpg", caption: "Sign-up screen with profile photo picker" },
            { file: "03-feed.jpg", caption: "Home feed — posts with likes, captions, and comment counts" },
            { file: "04-comments.jpg", caption: "Comment thread on a post" },
            { file: "05-search-grid.jpg", caption: "Search/discovery photo grid" },
            { file: "06-search-autocomplete.jpg", caption: "Live user search-as-you-type" },
            { file: "07-user-profile.jpg", caption: "Another user's profile with follow/unfollow" },
            { file: "08-create-post.jpg", caption: "Post-creation action sheet (camera / gallery)" },
            { file: "09-post-caption.jpg", caption: "Caption entry before publishing a post" },
            { file: "10-own-profile.jpg", caption: "Own profile — post grid, stats, sign-out" },
        ],
    },
    {
        slug: "cs314-gomoku-mpi",
        title: "Gomoku AI Player — MPI-Parallel Minimax",
        context: "Personal project",
        stack: ["C", "MPI"],
        summary:
            "A Gomoku-playing agent (15×15 board, 5-in-a-row to win) built as a distributed minimax search: the search tree is split across multiple MPI processes, with a master process dynamically handing out unexplored branches to idle workers. Connects to a game server over a socket and plays live matches in a round-robin tournament against other students' agents.",
        highlights: [
            "Real distributed computing, not simulated parallelism — actual MPI_Init/MPI_Bcast/MPI_Send/MPI_Recv/MPI_Iprobe run via mpirun across multiple OS processes.",
            "Iterative (not recursive) minimax with alpha-beta pruning — an explicit stack machine carrying move, depth, alpha, beta, and score per frame, for full control over pruning state in C.",
            "Dynamic (not static) master/worker load balancing — idle workers pull new work via a non-blocking probe instead of a fixed even split, and the master forwards the best alpha found across all processes to tighten every worker's pruning bound.",
        ],
        images: [
            {
                file: "01-board-state.png",
                caption:
                    "A live match mid-game: the MPI agent has built an open four — four in a row with both ends open, one move from an unstoppable win.",
            },
        ],
    },
    {
        slug: "cs214-dfa-image-compression",
        title: "DFA-Based Image Compression",
        context: "Personal project",
        stack: ["Java"],
        summary:
            "A lossless compression tool for black-and-white bitmap images that represents an image not as pixels but as a deterministic finite automaton over a 4-symbol alphabet (Culik–Kari style automata-based compression). Self-similar images compress to a handful of states regardless of resolution, since the automaton captures structural repetition rather than raw pixel data.",
        highlights: [
            "A formal-language concept applied directly to a real encoding problem — treats an image as a regular language and DFA minimization as the compression step, implementing ideas from an actual research paper rather than reproducing a known library.",
            "Multi-resolution decoding from a single compressed file — capping DFS depth during decompression reconstructs the image at a lower resolution, since each path length corresponds to one level of quadrant subdivision.",
            "Custom supporting data structures built for the project rather than reached for from a library — a stack that tracks both automaton state and accumulated path string, plus an adjacency-list DFA representation.",
            "A regression-style test harness (input/compressed/decompressed/invalid fixtures) built around the tool, including deliberately malformed automata to exercise the validation path.",
        ],
        images: [
            {
                file: "01-decompression-gui.jpg",
                caption:
                    "The Swing GUI's decompression view: raw DFA transition triples (left) alongside the reconstructed bitmap (right) — an eye image, showing fidelity on a textured, non-geometric source.",
            },
        ],
    },
    {
        slug: "cs144-moving-maze",
        title: "Moving Maze",
        context: "Personal project",
        stack: ["Java", "Swing GUI"],
        summary:
            "A 4-player sliding-tile maze game (Labyrinth-style) where the board itself reshapes every turn: each player slides a floating tile into a row or column edge, shunting the row/column across and ejecting a tile out the opposite side, before moving along whatever path the new layout allows.",
        highlights: [
            "Recursive backtracking pathfinding that respects per-tile connections — a move is only legal if each tile's encoded exits actually connect to the next tile's entry side, not just that the next tile is adjacent.",
            "One game engine, two renderers — all game state and turn logic is shared between a Unicode-box-drawing console renderer and a sprite-based Swing GUI, with no duplicated game rules.",
            "File-driven board and move input, including recorded move sequences that can be replayed from file for deterministic testing against expected-output fixtures.",
        ],
        images: [
            { file: "01-slide-rotate-phase.png", caption: "GUI — tile insertion phase: choosing where to slide the floating tile into the 5×5 board" },
            { file: "02-move-phase.png", caption: "GUI — movement phase after the slide, board reshaped, floating tile repositioned" },
        ],
    },
    {
        slug: "cs114-impasse",
        title: "Impasse",
        context: "Personal project",
        stack: ["Java", "Swing GUI"],
        summary:
            "A block-placement puzzle game: players place colored blocks left-to-right into a square grid, and the board is checked after every move for three distinct illegal-state conditions — a blockade, a split, and a dead end — any of which immediately ends the game. Runs in both a text console mode and a Swing GUI mode with sound feedback.",
        highlights: [
            "Three independent board-scanning detectors, each a standalone, board-agnostic algorithm (column-run scanning, row-duplication search, repeated-substring search) run after every placement rather than fused into one combined check.",
            "Speculative move simulation for early-termination detection — before declaring the game unwinnable, the code temporarily tries every possible next move at every open cell against all three detectors, then reverts, genuinely searching one ply ahead.",
            "Graceful degradation for platform-specific audio failure — sound playback is wrapped to silently no-op on a known Ubuntu incompatibility rather than crashing on an unsupported platform.",
        ],
        images: [
            { file: "01-gui-board.png", caption: "GUI — 30×30 board (3-color mode), several cascading placements down column 0 and across row 0" },
            { file: "02-blockade-termination.png", caption: "GUI — 8×8 board (2-color mode), a deliberately triggered blockade with the live termination message" },
        ],
    },
    {
        slug: "wedding-table-allocation",
        title: "Wedding Table Allocation",
        context: "Personal project",
        stack: ["HTML", "CSS", "JavaScript"],
        summary:
            "A small single-purpose site built for a real wedding: guests enter their name to look up their assigned table, revealed with a card-flip animation. Built and hosted with zero backend infrastructure — the guest list is a JSON file in the same repo, fetched directly from GitHub's raw content CDN.",
        highlights: [
            "Zero-infrastructure data source — the guest list is fetched client-side directly from raw.githubusercontent.com; updating it is a git push, with no database or server to deploy.",
            "Two-sided guest matching — looks a person up by either their own name or their named plus-one's name, reflecting that not every guest RSVP'd under their own name.",
            "Fully JS-driven responsive sizing — computes font sizes and element dimensions from window.innerWidth/innerHeight on load and resize instead of relying on CSS breakpoints.",
        ],
        images: [
            { file: "01-wedding1.jpg", caption: "Lookup form — enter name and surname" },
            { file: "02-wedding2.jpg", caption: "Result view after the card flips — guest name(s) and assigned table number" },
        ],
    },
];
