# Valorant Hub

A full-stack VALORANT fan hub. Browse agents, maps and the arsenal, then create an account to shop a daily-rotating store with a server-side VP wallet, claim daily rewards, save favourite agents and build a collection.

**Live demo:** _add your Vercel URL here_

![Valorant Hub](client/public/assets/brand/agents-lineup.webp)

## Features

**Frontend**
- **React 19 + Vite**, with every route code-split via `React.lazy`
- Data fetching with React 19's `use()` and Suspense, a shared promise cache that dedupes requests, and per-section error boundaries with retry
- **Dark / light mode** that follows the OS preference, persists the user's choice, avoids a flash of the wrong theme, and switches with a circular View Transitions reveal
- **Animations with Motion:** page transitions, a scroll-linked parallax hero, staggered reveals, shared-layout tab indicators, animated counters, stat bars and toasts, all disabled automatically when the OS asks for reduced motion
- Valorant-inspired design system built on **Tailwind CSS v4** design tokens: angular clipped corners, skin-tier colours, and ability icons tinted with CSS masks so they adapt to the theme
- Accessible by default: keyboard-friendly modals (focus trap, Escape to close, focus restore), ARIA tabs, a skip link and labelled controls
- Fully responsive, with an animated mobile menu

**Backend**
- **Express 5 REST API** with a layered structure: routes → middleware → controllers → models/services
- **JWT auth in httpOnly cookies** (no tokens in `localStorage`), bcrypt password hashing and case-insensitive unique usernames
- **Atomic, race-safe purchases.** The balance check, duplicate check, VP deduction and inventory push happen in a single MongoDB update. Prices always come from the server catalog, never from the client.
- **Deterministic daily store rotation** (seeded PRNG) that every serverless instance agrees on, refreshing at 00:00 UTC
- 24-hour daily-reward cooldown enforced in the database query
- Joi validation with field-level error messages, centralised error handling, Helmet security headers, rate-limited auth routes, and CDN cache headers for static content
- Serverless-friendly MongoDB connection caching, so the same Express app runs locally and as a **Vercel Function**

**Quality**
- Backend integration tests (Vitest + Supertest + in-memory MongoDB) covering auth, validation, purchases (including concurrent double-buys), rewards and favourites
- Frontend unit and component tests (Vitest + Testing Library)
- ESLint, and GitHub Actions CI running lint, tests and the build on every push

## Tech stack

| Layer | Tools |
| --- | --- |
| Client | React 19, React Router, Vite, Tailwind CSS v4, Motion, Lucide icons |
| Server | Node.js 22+, Express 5, Mongoose, MongoDB, JSON Web Tokens, Joi, Helmet |
| Testing | Vitest, Supertest, mongodb-memory-server, Testing Library |
| Deploy | Vercel (static site + serverless function), MongoDB Atlas |

## Project structure

```
valorant/
├── api/
│   └── index.js            # Vercel serverless entry, which wraps the Express app
├── client/                 # React SPA
│   ├── public/assets/      # Optimised WebP images (agents, abilities, maps, weapons, skins, cards)
│   └── src/
│       ├── components/     # layout/ (navbar, footer…), ui/ (button, modal…), shared widgets
│       ├── context/        # Auth, Theme and Toast providers
│       ├── hooks/          # useResource, useCountdown, useDocumentTitle
│       ├── lib/            # API client and form validation
│       └── pages/          # One file per route, lazy-loaded
├── server/                 # Express REST API
│   ├── src/
│   │   ├── config/         # env + MongoDB connection
│   │   ├── controllers/    # Request handlers
│   │   ├── data/           # Game content (agents, maps, weapons, player cards)
│   │   ├── middleware/     # auth, validation, error handling
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Route table
│   │   ├── services/       # Store catalog and daily rotation
│   │   ├── app.js          # Express app (shared by local server and Vercel)
│   │   └── server.js       # Local entry point
│   └── tests/
├── vercel.json
└── package.json            # npm workspaces + root scripts
```

## API

All routes are prefixed with `/api`. 🔒 means a session cookie is required.

| Method | Route | Description |
| --- | --- | --- |
| GET | `/health` | API and database status |
| GET | `/agents`, `/agents/:id` | Agents with roles and abilities |
| GET | `/maps`, `/maps/:id` | Maps |
| GET | `/weapons`, `/weapons/:id` | Weapons, stats and skins |
| POST | `/auth/register` | Create an account (starts with 5,000 VP) |
| POST | `/auth/login` | Sign in |
| POST | `/auth/logout` | Sign out |
| GET | `/auth/me` | Session probe: the current user, or `null` for guests |
| GET | `/store` | Today's offers and the refresh time |
| POST | `/store/purchases` 🔒 | Buy an item: `{ "itemId": "vandal-champions" }` |
| GET | `/users/me/collection` 🔒 | Owned items with purchase details |
| POST | `/users/me/daily-reward` 🔒 | Claim 500 VP (once every 24 h) |
| PUT / DELETE | `/users/me/favorites/:agentId` 🔒 | Add or remove a favourite agent |

Errors return a consistent shape: `{ "message": "...", "code": "VALIDATION_ERROR", "details": { "field": "..." } }`.

## Local setup

**Prerequisites:** Node.js 22+ and MongoDB Community Server running locally (or a MongoDB Atlas connection string).

On Windows, MongoDB can be installed as an auto-starting service with:
```powershell
winget install MongoDB.Server
```

Then run:

```bash
# 1. Install everything (client + server workspaces)
npm install

# 2. Configure the API
cp server/.env.example server/.env
#    then set JWT_SECRET (and MONGODB_URI if you aren't using the local default)

# 3. Start the API (http://localhost:5000) and the client (http://localhost:5173) together
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start API and client with hot reload |
| `npm test` | Run server and client test suites |
| `npm run lint` | Lint the client |
| `npm run build` | Production build of the client into `client/dist` |
| `npm start` | Start the API without watch mode |

## Deploying to Vercel

The client is deployed as a static site and the API as a single serverless function (`api/index.js`). `vercel.json` routes `/api/*` to the function and everything else to the SPA.

1. **Create a free MongoDB Atlas cluster** at <https://www.mongodb.com/cloud/atlas>
   - Create a database user.
   - Under *Network Access*, allow `0.0.0.0/0`, because Vercel functions don't have fixed IPs.
   - Copy the connection string and add a database name, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/valorant-hub`.
2. **Import the repository** in Vercel (New Project → Import Git Repository). Leave the root directory as the repo root; the build settings come from `vercel.json`.
3. **Add environment variables** (Project → Settings → Environment Variables):
   - `MONGODB_URI`: your Atlas connection string
   - `JWT_SECRET`: a long random string (`node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`)
4. **Deploy.** Then check `https://<your-app>.vercel.app/api/health`, which should return `"database": "connected"`.

Or deploy from the CLI:

```bash
npm i -g vercel
vercel login
vercel link
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel --prod
```

## Disclaimer

Valorant Hub is a fan project for learning and portfolio purposes. It isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc. Game assets belong to Riot Games; renders were sourced via the community [valorant-api.com](https://valorant-api.com) and are stored locally as optimised WebP.

## Author

**Dhrumil Sheth**
