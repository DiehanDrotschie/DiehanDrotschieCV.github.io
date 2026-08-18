# InkLink — Collaborative Markdown Notes (CS343 — Stellenbosch University, 3rd Year, group project)

**Stack:** React 18 + TypeScript + Vite (frontend) · Express + Sequelize/PostgreSQL, hosted on Supabase (backend) · Cloudinary (file storage) · WebSockets + Yjs (real-time sync) · JWT auth

**My role:** Frontend (one of three frontend devs on a 6-person team; three others on backend)

## Summary

A collaborative note-taking web app: users write and format notes in markdown with a live preview, share individual notes with other users at different permission levels (read/write/admin), and edit the same note simultaneously with changes propagating over a WebSocket connection. Built as a team project with an explicit Controller→Service→Repository backend architecture and a REST API documented separately from the code.

## Architecture

- **Hybrid storage split**: note *metadata* (title, category, description, owner, timestamps) lives in Postgres via Sequelize models and migrations; note *content* is stored as an actual markdown file object uploaded to Cloudinary, with only the resulting URL kept in the metadata row. Loading a note means fetching metadata from the API, then fetching the markdown body from that Cloudinary URL.
- **Controller → Service → Repository layering** on the backend (`noteController` → `noteService` → `noteRepository`, same pattern for users): input validation (Joi schemas) and business rules live in the service layer, data access is isolated in the repository layer, keeping controllers thin.
- **Real-time collaboration over WebSockets**: the editor opens a WebSocket connection per note and broadcasts content changes to every other client viewing that note, so simultaneous edits and live presence (who else is currently viewing a note) propagate without a page refresh. The stack also includes Yjs/`y-websocket` CRDT infrastructure server-side (`Y.Doc` + `WSSharedDoc` keyed by note ID) for conflict-free merging of concurrent edits, alongside the simpler content-broadcast path used directly in the note editor.
- **Row-level sharing model**: a separate `NoteAccess` join table (note, user, access-granter, access type: read/write/admin) decouples "who owns a note" from "who can see or edit it," supporting the invite-by-email flow in the editor.
- **Auth**: JWT issued on login/register, read from either an httpOnly cookie or an `Authorization` header by an Express middleware; OTP email verification on registration via a dedicated email service and template.

## Frontend work (my focus)

- **Markdown editor integration**: EasyMDE (CodeMirror-based) wired into React via refs rather than a React-native markdown library, with a custom `marked`-based preview renderer and CSS overrides patched in imperatively to fix EasyMDE's default heading styles.
- **Global note state via React Context** (`OpenNotes` context): tracks which notes are open, their live content, and title edits across the sidebar and editor without prop-drilling, so a title change in one place (e.g. the sidebar) is reflected immediately in the editor header.
- **Optimistic local caching**: note content is mirrored into `localStorage` keyed by note ID as a read-through cache, so reopening a recently-viewed note doesn't require waiting on a Cloudinary fetch.
- **Animated route transitions** between the login and register views (`PageTransition` component, `react-transition-group`) rather than a hard page swap, and a client-side router (`react-router-dom`) separating auth, home, profile, and note-editing views.

## Screenshots

| File | Shows |
| --- | --- |
| `01-login.png` | Login page |
| `02-register.png` | Register page — shows the animated panel-swap transition from login |
| `03-note-editor.png` | The markdown editor: EasyMDE toolbar, live-rendered preview (headings, bold/italic, blockquote), category selector, and the invite/collaborator UI |
| `04-home-placeholder-data.png` | The "All Notes" home page with placeholder notes — card grid with thumbnails, sort/filter controls, and pagination |
| `05-profile-placeholder-data.png` | Profile page with placeholder account data — avatar, role, and account details |

*Screenshots were captured by running the frontend locally against the actual codebase. The original Supabase project backing this app has since been decommissioned (course project, not a maintained service). For `04-home-placeholder-data.png` and `05-profile-placeholder-data.png`, the note-list and user API responses were mocked at the network layer with realistic placeholder data so those pages could be shown fully populated; the other screenshots show the app's real state. The WebSocket/collaboration code described above is read from the source, not simulated.*
