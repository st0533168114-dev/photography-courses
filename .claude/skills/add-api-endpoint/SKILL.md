---
name: add-api-endpoint
description: Use when adding a new API endpoint (server route + client API function).
---

# Add an API endpoint

1. Read `.claude/rules/api.md` first.
2. New entity → full CRUD: Model + Controller + Router + `app.js`. New action on an existing entity → only that controller and router.
3. Add the route to the router with the right middleware, before any `/:id` it could collide with.
4. Add the controller action.
5. New router only → `app.use` in `app.js`.
6. Add the matching function to `client/src/api/<domain>Api.js`, same method and path.
7. Add the consumer: a thunk in the slice (`"domain/action"`), or a direct call with `useState`/`useEffect` for admin pages of users, orders, payments and FAQ.
8. Admin action → confirm `isAdminMiddleware` on the server even if the UI is behind `AdminRoute`.
9. Run `npm run lint` in `client/`.
