# Server (`server/`)

Express REST API on MongoDB (Mongoose).

## Commands

```bash
npm start         # node app.js (listens on http://localhost:1234)
```

## Architecture

Layered: **Router → Middleware → Controller → Service → Model**. Entry point `app.js` wires CORS, `express.json()`, DB connection, and route registration.

- `Routers/`, `Controllers/`, `Services/` — see `.claude/rules/api.md`. Existing services:
  - `shoppingCart.service.js` — `resolveCart` derives name, price, image and `isAvailable`/`previousPrice` from `courses` at read time; used by every cart response and by `orders.post`, so displayed and charged totals can't diverge
  - `media.service.js` — `signUpload` signs Cloudinary uploads (allowed preset and folders only); `isCloudinaryUrl` checks a URL belongs to our Cloudinary account
- `Models/<entity>.js` — `mongoose.Schema` → `export default mongoose.model("<collectionPlural>", XxxSchema)`
- `Middlewares/jwt.middleware.js` — validates `Authorization: Bearer <token>`, sets `req.user = { userId, role }`
- `Middlewares/isAdmin.middleware.js` — gates admin-only actions

## Conventions

- ES Modules, `.js` extensions required in import paths
