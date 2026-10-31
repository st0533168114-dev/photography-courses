# Client (`client/`)

React SPA (Vite). These rules apply to pages and components alike; component-only rules are in `.claude/rules/client/components.md`, slice-writing rules in `.claude/rules/client/redux.md`.

## Commands

```bash
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # preview production build
npm run lint      # ESLint
```

## Architecture

SPA using `BrowserRouter` + routes defined in `src/App.jsx`, with `checkAuth` dispatched on load. Data flow: `API/*.js` (Axios) → `createAsyncThunk` in a Redux slice → components/pages via `useSelector`/`useDispatch`. Shared Axios instance in `src/API/axiosConfig.js` attaches the Bearer token from `localStorage` via an interceptor.

- Pages: `src/pages/X.jsx` + `src/CSS/pages/X.module.css`, one route each in `App.jsx`
- Components: `src/components/X.jsx` + `src/CSS/components/X.module.css`, reused inside pages
- Admin pages for users, orders, payments and FAQ don't use Redux: they call `API/` directly with `useState`/`useEffect`
- Admin tables use `DataTable` (`columns` with optional `render`, `rows`, `onEdit`, `onDelete`)

## General

- JavaScript only (`.jsx`/`.js`), no TypeScript
- Import order: React hooks → Router/Redux → local child components → API/slices → CSS Module import as `styles`. Import only what the file uses
- Naming: PascalCase for components/pages, camelCase + `Api`/`Slice` suffix for logic files; thunk action names use `"domain/action"` strings
- UI text is in Hebrew; users are called "משתמשים", never "לקוחות"

## Function skeleton

- `export default function X()`; everything inside is an arrow function in a `const`.
- Order inside the function: 1. props → 2. hooks (`useDispatch`, `useNavigate`, `useSelector`) → 3. state / refs → 4. `useEffect` → 5. early returns → 6. handlers → 7. JSX.
- Constants that don't depend on props go above the function, `UPPER_SNAKE_CASE`.
- Handlers are named `handleX`.
- Inline arrow in JSX only for a single call (`onClick={() => onEdit(row._id)}`); anything longer goes into a `handleX`.
- No Fragment around a single element.

## Reading Redux state (fixed pattern — match it exactly)

Every file that consumes a slice is written the same way. Deviating is a review finding, even when the alternative works:

```jsx
// one useSelector per field, never a destructured object literal
const coursesList = useSelector((state) => state.courses.coursesList || []);
const isLoading = useSelector((state) => state.courses.isLoading);

// secondary data the page only reads: fetch it only if the store is empty.
// Hebrew "why" comment above, condition on `.length === 0`, dependency array is [dispatch] alone
useEffect(() => {
  if (coursesList.length === 0) {
    dispatch(getCourses());
  }
}, [dispatch]);
```

- **A page's own primary fetch** additionally wraps `dispatch(...).unwrap()` in `try/catch` and stores the message in a **local** `loadError` state — the slice's `error` is never read for this. A failed mutation elsewhere leaves an error stuck in the global slice, which would otherwise replace this page's table with a stale error. Pages that own a slice's list also `dispatch(clearXxxError())` first (`AdminCoursesPage`, `AdminCategoriesPage`).
- Reference implementations: `AdminCoursesPage.jsx`, `AdminCategoriesPage.jsx`, `AdminCourseFormPage.jsx`, `CoursesPage.jsx`, `MyCoursesPage.jsx`.

## Async and errors

- Make a handler `async` only if it awaits a thunk or an `API/` call. Navigation, toggles and props callbacks stay sync.
- Every `await` is wrapped in `try/catch`. Add `finally` to reset a loading flag (`isAdding`).
- Always `.unwrap()` thunks you await, or `catch` never fires.
- Result affects only this file's UI (bubble, disabled button) → `async` + `try/catch`. Slice already exposes `isLoading`/`error` and a component shows them → plain `dispatch()` without `await` (see `CategoryGrid.jsx`).
- In `useEffect`: always a block body; define an inner async function with `try/catch/finally` and call it; never make the effect itself `async` (see `FAQSection.jsx`).
- Error message: `catch (err)` with `err || "..."` after an awaited thunk (slices reject with a string; `addToCart` rejects with `{ message, status }`), `err.response?.data?.message || "..."` after a direct `API/` call.
- Show the error to the user, don't only log it.
- If a logged-out user can trigger the action, 401 → `navigate("/login", { state: { from, message } })` (see `AddToCartButton.jsx`).
- User feedback is a small bubble next to the button that triggered it (see `AddToCartButton.jsx`), never `alert()` or a global toast.

## UI states

- Early returns: `טוען נתונים...` / `שגיאה: {error}` / `{emptyMessage || "לא נמצאו נתונים"}`.
- A busy flag that belongs to one button is local `useState`, not in the store.

## Buttons and accessibility

- `type="button"` on every button that isn't a form submit.
- `disabled` while busy, and the label changes (`"הוסף לסל"` → `"מבצע הוספה..."`).
- A button inside a clickable card calls `e.stopPropagation()` first.
- Icon-only button: `title` + `aria-label`. Toggle: `aria-expanded`.

## Styling

- CSS Modules only: `className={styles.x}`, using tokens from `src/styles/variables.css` — no hardcoded hex/rgb/hsl colors, prefer `--space-*`/`--radius-*` over raw px. No UI libraries (Tailwind, MUI, etc.)
- One conditional class: `` `${styles.a} ${cond ? styles.b : ""}` ``. Several: `[styles.a, cond && styles.b].filter(Boolean).join(" ")`.
- New classes go into the file's existing `.module.css`.

## Pages

- Wrap the content in `Header` + `<main>` + `Footer`.
- The page fetches its own primary data (see "Reading Redux state").

## Changing existing code

- Change only what was asked. If the file deviates from these rules, point it out and ask; don't fix it silently.

## Before finishing

- Every awaited thunk uses `.unwrap()`.
- No unused imports.
- `npm run lint` in `client/` passes.
