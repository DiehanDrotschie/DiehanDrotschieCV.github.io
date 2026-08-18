# E-Spaza — Multi-Shop Ordering Platform (CS344 — Stellenbosch University, 3rd Year, group project)

**Stack:** React 18 + TypeScript + Vite + Apollo Client (frontend) · Apollo Server + TypeGraphQL + TypeORM + PostgreSQL (backend) · Auth0 (auth) · Cloudinary (images) · HERE Maps API (routing) · barcode-scanning via device camera

**Course focus:** CS344 is Stellenbosch's software engineering / Agile course — the project was run as Scrum sprints with sprint-specific technical documents, retros, and a CI/CD pipeline (`.gitlab-ci.yml`), not just a single hand-in.

## Summary

E-Spaza digitizes South African spaza shops (small, informal home-run convenience stores). Customers browse and order stock from multiple nearby spaza shops in one session; shop owners and staff manage inventory (including scanning items in via the device camera), fulfil orders, and pull sales/stock reports. A standout feature is multi-shop route suggestion: when a customer's order spans several shops, the app proposes an efficient collection route rather than leaving them to figure out the geography themselves.

## Architecture

- **GraphQL end-to-end, code-first**: the backend defines its schema with `type-graphql` decorators directly on TypeORM entities/resolvers (no hand-written `.graphql` SDL files to keep in sync), served through Apollo Server; the frontend consumes it via Apollo Client with normalized caching.
- **Relational schema for a real multi-shop marketplace**: TypeORM entities for `users`, `shops`, `items`, `categories`, `inventory`, `orders`, plus explicit join entities (`users_shops`, `order_items`, `orders_shops`) — modelling that one order can span multiple shops and one user can hold different roles at different shops, not just a flat single-tenant schema.
- **Role-based access** (Shopper / Staff / Admin) enforced through the resolver layer, with an admin-only user-management screen for onboarding staff and revoking access.
- **Third-party integrations wired into real features, not stubs**: Auth0 for authentication (email/password + Google), Cloudinary for item/shop images, and the HERE Maps API for turn-by-turn polyline route calculation across multiple pickup points when an order spans shops.
- **Camera-based stock intake**: the inventory page opens a live `MediaStream` from the device camera so staff can scan barcodes to add or update stock, rather than manual SKU entry.
- **Reporting**: dedicated report resolvers/utilities generate stock and order-history exports in CSV and PDF (`jspdf` + `jspdf-autotable`) for shop admins.

## Technical highlights

- **Code-first GraphQL schema** derived from the same TypeORM entity classes used for persistence, cutting out an entire layer of schema/type duplication between the ORM and the API.
- **Sprint-driven development with artifacts to match**: separate Sprint 1/Sprint 2 technical documents, a GraphQL endpoint reference doc, retro notes, and a flowchart of the ordering flow — evidence of planning and iterating on the design rather than building it in one pass.
- **Multi-stop route optimization**, not just a single origin→destination lookup: aggregating a shopper's cart across shops into one suggested collection route via the HERE routing API.
- **Real device hardware in the browser**: the inventory scanning flow uses `getUserMedia` for a live camera feed, integrated with barcode-scanning (`@zxing/library` / `quagga` in the dependency set) rather than just a file-upload fallback.

## Screenshots

| File | Shows |
| --- | --- |
| `01-login.png` | Login page — email/password and Google (Auth0) sign-in |
| `02-register.png` | Registration page |
| `03-cart.png` | Cart / order summary view |
| `04-app-shell.png` | The authenticated app shell — sidebar navigation (Dashboard, Orders, Notifications) and top nav |
| `05-home-placeholder-data.png` | Home page with placeholder stock data — categories sidebar, hero search/filter banner, and the item grid with add-to-cart |
| `06-dashboard-admin.png` | Admin dashboard — order list across the shop and a live notifications feed |
| `07-inventory-stock.png` | Inventory/stock management — item table with quantity, price, edit/delete, add new item, and export to PDF |
| `08-specific-order.png` | A single order's detail view — line items with per-item fulfilment action, shop info, order summary, and the suggested-route map panel |

*Screenshots were captured by running the frontend locally against the real codebase. The backend's GraphQL API and database are not connected here (course-project credentials, not a maintained live service). For `05` through `08`, the GraphQL responses were mocked at the network layer with realistic placeholder stock/order/notification data so each page could be shown fully populated — `08-specific-order.png` was reached by clicking through from a (mocked) Orders page so React Router's navigation state matched what the real app produces, rather than being hand-constructed; `01`–`04` show the app's real loading/empty states. The architecture and code described above are read directly from the source, not simulated.*
