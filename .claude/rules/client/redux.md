---
paths:
  - "client/src/redux/**"
---

# Redux rules

Slice-writing rules. How pages and components read the store is in `client/CLAUDE.md` ("Reading Redux state").

## Files
- One slice per domain: `src/redux/slices/<domain>Slice.js`, registered in `store.js` under the same `<domain>` key.
- Import the API module as a namespace: `import * as coursesApi from "../../api/coursesApi";`.

## Thunk

```js
export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ courseId, course }, thunkAPI) => {
    try {
      const response = await coursesApi.updateCourse(courseId, course);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "עדכון הקורס נכשל");
    }
  }
);
```

- Action name `"<sliceName>/<thunkName>"`, the thunk named like the `api/` function it calls.
- One argument: a single value (`courseId`), or an object for several (`{ courseId, course }`); `_` when there is none.
- Reject with a Hebrew string: the server's `message`, otherwise a fallback. The only exception is `addToCart`, which also needs `status` for the 401 redirect.
- Delete returns the id it deleted, since the server response isn't needed to update the list.

## Slice
- `initialState`: the data (`xxxList: []`, or `null` for a single object), `isLoading: false`, `error: null`.
- Every thunk gets all three cases:
  - `pending` → `isLoading = true`, `error = null`
  - `fulfilled` → `isLoading = false` + update the data
  - `rejected` → `isLoading = false`, `error = action.payload`
- Update the list in place after a mutation, never refetch: add → `push`, update → `findIndex` and replace, delete → `filter` by id.
- A slice whose list is shown on an admin page has a `clearXxxError` reducer (see "Reading Redux state").
- Exports: thunks as named exports, `export const { ... } = xSlice.actions;`, and `export default xSlice.reducer;`.
- A side effect that must happen with a state change (`localStorage` in `logoutUser`, `checkAuth`) goes into the reducer or thunk, with a Hebrew "why" comment.
