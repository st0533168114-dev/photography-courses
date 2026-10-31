---
paths:
  - "server/Routers/**"
  - "server/Controllers/**"
  - "server/Services/**"
  - "server/app.js"
  - "client/src/API/**"
---

# API rules

An endpoint is one chain: `app.js` → `Routers/` → `Controllers/` (→ `Services/`) → Model, and on the client `src/API/<domain>Api.js`. Every client function maps to exactly one server route with the same method and path.

## Router — `server/Routers/<entity>.router.js`
- One line per route: `XRouter.<method>(path, ...middlewares, XController.<action>)`. No logic, no inline handlers.
- Middleware order: `jwtMiddleware` then `isAdminMiddleware`.
- Public catalog reads (`courses`, `categories`, `faq`): no middleware.
- A logged-in user's own resource (`/profile`, `/user-orders`, cart, `POST /orders`): `jwtMiddleware` only, ownership checked in the controller.
- Everything else, and any list of all users' data: `jwtMiddleware, isAdminMiddleware`.
- A route that deviates from its method's default gets a short Hebrew comment above it (see `OrdersRouter.post("/:id/capture")`).
- Textual paths before params: `/count`, `/profile`, `/user-orders`, `/admin/all`, `/category/:id` before `/:id`; `/:id/status` before `/:id`; `/items/:courseId` before `/items`.
- Path shape: plural resource, sub-actions as a noun segment (`/:id/status`, `/items`, `/signature`); admin-only variants of a user route under `/admin/...`.
- New router → `app.use("/<pluralCamelCase>", xRouter)` in `app.js` next to the others.

## Controller — `server/Controllers/<entity>.controller.js`

Fixed skeleton:

```js
put: async (req, res) => {
  const { id } = req.params;                 // 1. read input before try
  const { question, answer } = req.body;
  if (!question) {                           // 2. input validation → 400, before try
    return res.status(400).json({ message: "..." });
  }
  try {
    const updatedFaq = await faqs.findByIdAndUpdate(  // 3. DB work
      id,
      { question, answer },
      { new: true, runValidators: true }
    );
    if (!updatedFaq) {                       // 4. not found → 404 with return
      return res.status(404).json({ message: "השאלה לא נמצאה" });
    }
    res.status(200).json(updatedFaq);        // 5. success
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
```

- The controller is an object literal `XxxController = { get, getById, post, put, delete, ... }`, default-exported.
- Action names: `get`, `getById`, `post`, `put`, `delete`, `getCount`; otherwise a camelCase verb (`changeStatus`, `getUserOrders`, `addToCart`, `login`).

### Status codes and bodies
| Case | Status | Body |
|---|---|---|
| Read / update / delete succeeded | 200 | the document (delete returns the deleted document) |
| Created | 201 | the new document, or `{ order, payments, user }` when several were created |
| Count | 200 | `{ count }` |
| Missing or invalid input | 400 | `{ message }` in Hebrew |
| Bad login | 401 | `{ message }` |
| Not the owner / inactive account | 403 | `{ message }` |
| Document not found | 404 | `{ message: "<X> לא נמצא/ה" }` |
| Conflicts with current state (delete category with courses, illegal status transition, delete non-draft course) | 409 | `{ message }` explaining what is allowed |
| Unexpected error | 500 | `{ error: error.message }` |

- Every early exit is `return res.status(...)`.
- 4xx messages are Hebrew and user-facing.
- A user's own resource that may not exist yet → empty shape with 200, not 404 (see cart `getByUserId`).

### Input and security
- `userId` for "my" data only from `req.user.userId`, never from body/params/query.
- Ownership: `if (ownerId.toString() !== req.user.userId && req.user.role !== "admin") return 403`.
- `post`: build the document from destructured allowed fields, never `new Model(req.body)`.
- `put` reachable by a non-admin: whitelist fields (`SELF_EDITABLE` in users). Admin-only `put` may pass `req.body`, unless a field has its own route (`status` in courses → 400).
- Server-decided fields (`status`, `transactionId`, prices, totals) are set in the controller, never taken from the client.
- Ids inside an update operator (`$ne`, `$pull`) → `mongoose.Types.ObjectId.isValid`, else 400.
- Strings from an open route that go into a Mongo filter → `typeof === "string"`.
- Users are always returned with `.select("-password")`.
- Updates use `{ new: true, runValidators: true }`.
- Image URLs must pass `isCloudinaryUrl` (see `hasNonCloudinaryImage` in courses).

## Service — `server/Services/<entity>.service.js`
- Only for logic used by more than one controller.
- Named exports, plain functions: take documents/values, return plain objects or `null`.
- Never `req`/`res`, never status codes; the controller turns `null` into 400/404.
- New shared helpers go here, not as an extra controller export.

## Client — `client/src/API/<domain>Api.js`

```js
import api from "./axiosConfig";

export const getFaqs = async () => {
  const response = await api.get(`/faq`);
  return response.data;
};
export const updateFaq = async (faqId, faqToUpdate) => {
  const response = await api.put(`/faq/${faqId}`, faqToUpdate);
  return response.data;
};
```

- Always `import api from "./axiosConfig"`; never `axios` directly, never set `Authorization` (only `userApi.js` saves the token after login/register).
- Every function: `export const name = async (...) => { const response = await api.<method>(\`...\`); return response.data; }`. Path is always a template literal.
- No `try/catch` here; errors propagate to the caller.
- Return `response.data`; a wrapped single value returns the value (`response.data.count`, `response.data.signature`).
- Names:
  | Server | Client |
  |---|---|
  | `GET /x` | `getXs` |
  | `GET /x/:id` | `getXById(xId)` |
  | `GET /x/count` | `getXsCount` |
  | `POST /x` | `addX(x)` |
  | `PUT /x/:id` | `updateX(xId, xToUpdate)` |
  | `DELETE /x/:id` | `deleteX(xId)` |
  | own resource (`/user-orders`, `/profile`, cart) | `getUserXs`, `getProfile`, `getShoppingCart`, no `userId` argument |
  | other action | verb + noun matching the controller action (`changeCourseStatus`, `addToShoppingCart`) |
- Arguments: id first, then the body. A one-field body takes the value and wraps it: `(courseId, action) => api.put(..., { action })`.
- Query string through `{ params }`, not by building the URL.
- Never send `userId` for the current user's own data.
- One file per server router; add new functions to the existing domain file.
