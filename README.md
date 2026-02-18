## InvitePak – 3D Digital Invitation Platform

InvitePak is a full‑stack web platform for creating and sharing elegant, mobile‑first digital invitations for Pakistani events (Nikkah, Mehndi, Baraat, Walima, birthdays and more).

The MVP supports:
- Creating invites via a guided form
- Dynamic invite URLs: `/invite/{slug}`
- A 3D WebGL invite view (React Three Fiber)
- Google Maps integration
- Add‑to‑Calendar links
- Export to PNG and printable A4 PDF

---

## Tech Stack

- Monorepo: npm workspaces
- Frontend:
  - Next.js 14 (App Router)
  - React
  - Tailwind CSS
  - React Three Fiber (`@react-three/fiber`) and Drei (`@react-three/drei`)
- Backend:
  - Node.js + Express
  - MongoDB (via Mongoose)
  - Zod (payload validation)
  - PDFKit (PDF export)

---

## Project Structure

Top level:

- `apps/web` – Next.js frontend
- `apps/api` – Express API server
- `PRD` – Product and 3D architecture documents
- `.env.example` – Root example for convenience

Frontend (`apps/web`):

- `app/`
  - `page.tsx` – Landing page
  - `create/page.tsx` – Invite creation flow
  - `invite/[slug]/page.tsx` – Dynamic invite view (3D scene + SEO)
  - `layout.tsx` – Root layout and global metadata
- `src/components/invite/InviteScene.tsx` – React Three Fiber invite scene
- `src/lib/api-client/invites.ts` – API client for invites (create, fetch, export)
- `src/types/invite.ts` – Shared Invite type for the frontend

Backend (`apps/api`):

- `src/index.ts` – Server bootstrap and HTTP entrypoint
- `src/app.ts` – Express app configuration (middleware, routing)
- `src/config/db.ts` – MongoDB connection
- `src/config/env.ts` – Environment loader and validation
- `src/modules/invites/`
  - `invite.model.ts` – Mongoose schema and model
  - `invite.schema.ts` – Zod schema for create payload
  - `invite.repository.ts` – DB access and persistence
  - `invite.service.ts` – Invite domain logic
  - `invite.controller.ts` – HTTP controllers (create, get, export PDF, track view)
  - `invite.router.ts` – Express router wired under `/api/invites`

---

## Environment Setup

### 1. Root setup

From the project root:

```bash
npm install
```

This installs dependencies for the workspaces (`apps/web`, `apps/api`).

### 2. API environment (`apps/api/.env`)

Copy the example file and fill in values:

```bash
cd apps/api
cp .env.example .env
```

`.env.example`:

```bash
NODE_ENV=development
PORT=4000
MONGODB_URI=
FRONTEND_BASE_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
```

Required configuration:

- `MONGODB_URI` – MongoDB connection string (e.g. MongoDB Atlas)
- `PORT` – API port (default `4000`)
- `FRONTEND_BASE_URL` – URL where the web app is served
- `ALLOWED_ORIGINS` – Comma‑separated CORS origins (usually matches frontend URL)

### 3. Web environment (`apps/web/.env`)

Copy the example file:

```bash
cd apps/web
cp .env.example .env
```

`.env.example`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Optional additional variables you can define:

- `NEXT_PUBLIC_SITE_URL` – Public site URL used for canonical/meta URLs (e.g. `https://invitepak.com`)

---

## Running the Apps Locally

Make sure MongoDB is running and accessible via the configured `MONGODB_URI`.

From the project root:

### 1. Start the API

```bash
npm run dev:api
```

This runs the Express API at `http://localhost:4000` by default.

Key endpoints:

- `POST /api/invites` – Create invite
- `GET /api/invites/:slug` – Get invite by slug
- `POST /api/invites/:slug/export/pdf` – Generate A4 PDF from WebGL snapshot
- `POST /api/invites/:slug/view` – Increment invite view counter

### 2. Start the Web app

In a second terminal:

```bash
npm run dev:web
```

This runs Next.js at `http://localhost:3000`.

Main routes:

- `/` – Landing page
- `/create` – Invite creation form
- `/invite/{slug}` – 3D invite viewer

---

## Build and Production

### Build both apps

From project root:

```bash
npm run build:api
npm run build:web
```

This compiles:

- Express API to `apps/api/dist`
- Next.js app to `apps/web/.next`

### Running API in production

From `apps/api`:

```bash
npm run start
```

Ensure production environment variables are set:

- `NODE_ENV=production`
- `MONGODB_URI` pointing to your production database
- `FRONTEND_BASE_URL` and `ALLOWED_ORIGINS` matching the live frontend

### Running Web in production

The web app can be:

- Deployed to Vercel, or
- Run with `next start` behind a reverse proxy.

From `apps/web`:

```bash
npm run build
npm start
```

Set at least:

- `NEXT_PUBLIC_API_BASE_URL` to your live API URL (e.g. `https://api.invitepak.com`)
- `NEXT_PUBLIC_SITE_URL` to the frontend URL for correct canonical/meta URLs

---

## Core Domain Concepts

### Invite

Invites are stored in MongoDB with fields including:

- `slug` – Unique identifier used in `/invite/{slug}` URLs
- `eventCategory` – `"NIKKAH" | "MEHNDI" | "BARAAT" | "WALIMA" | "BIRTHDAY"`
- `templateKey` – Template identifier (e.g. `nikkah-classic-01`)
- `eventTitle` – Main event title
- `primaryNames` – Names of bride/groom or hosts
- `date` / `time` – Event date/time (stored as `Date` + `time` string)
- `venueName` and `address` – Location details
- `mapsUrl` – Google Maps link
- `customMessage` – Optional message
- `language` – `"EN" | "UR" | "BOTH"`
- `viewCount` – Aggregated count of invite views

Creation payload is validated on the backend with Zod before persisting.

---

## Frontend Flow

### 1. Create invite (`/create`)

The `CreateInvitePage` collects:

- Event category
- Event title
- Names
- Date and time
- Venue name and address
- Optional Google Maps link
- Optional custom message
- Language

On submit:

- Sends a POST to `/api/invites`
- Receives a generated `slug`
- Redirects user to `/invite/{slug}`

### 2. Invite view (`/invite/{slug}`)

Server side:

- Uses `getInviteBySlug` to fetch invite data
- Exposes:
  - `generateMetadata` for SEO and social meta tags
  - JSON‑LD Event schema for better indexing

Client side:

- Renders `InviteScene`:
  - React Three Fiber `Canvas` with lights and a background plane
  - HTML invite card overlay with:
    - Category, title, names, date, time, venue, address, custom message
    - “Open in Google Maps” button (when `mapsUrl` is present)
  - Interaction toolbar:
    - Download PNG (from canvas `toDataURL("image/png")`)
    - Download PDF (via backend PDFKit endpoint)
    - Share via WhatsApp
    - Copy link
    - Add to Google Calendar
  - Analytics:
    - On mount, calls `/api/invites/:slug/view` to increment `viewCount`

---

## Testing and Quality

The current setup includes:

- Type‑safe APIs via Zod schemas and TypeScript
- Next.js build with type checking and ESLint
- Separate builds for API and Web

Before deploying, always:

```bash
npm run build:api
npm run build:web
```

If you add tests (recommended in future iterations), keep them within each app and wire them via scripts like `test:web` and `test:api`.

---

## Extending the System

Some natural next steps:

- Add more 3D templates per category and a template selection UI
- Implement device‑aware performance profiles (desktop vs mobile)
- Add admin analytics views using `viewCount` and other metrics
- Integrate more detailed SEO (localized keywords, event category pages)

