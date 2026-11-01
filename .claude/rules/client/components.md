---
paths:
  - "client/src/components/**"
  - "client/src/css/components/**"
---

# Component rules

Component-only additions to `client/CLAUDE.md`, which applies here too.

## Files
- A component is always a pair: `components/X.jsx` + `css/components/X.module.css`.
- Admin-only components go under `admin/` in both folders.

## Props
- `export default function X(props)`; destructure props on the first line of the body, never in the signature.
- Optional props get a default in the destructuring (`showAllCourses = true`) or with `||` at render (`label || "העלאת תמונה"`).

## Changing an existing component
- Before renaming or removing a prop, find every usage and update them all.
- A new prop is optional with a default, so existing usages keep working.

## Before finishing
- Both files exist with the same name in matching folders.
- Changed props → every usage updated.
