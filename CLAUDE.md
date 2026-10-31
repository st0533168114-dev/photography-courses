# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project layout

A single git repository (`https://github.com/st0533168114-dev/photography-courses`) with two apps:

- `client/` — React SPA (Vite), deployed on Vercel. Conventions: `client/CLAUDE.md`
- `server/` — Express REST API (MongoDB), deployed on Render. Conventions: `server/CLAUDE.md`

Run git commands from the root.

Together they form a digital photography courses e-commerce site: course/category catalog, auth, shopping cart, orders/payments, purchased-course access, and an admin panel.

No test runner is configured in either app.

## Code quality

Write code the way an experienced developer would, using the standard, accepted solution. When existing code is wrong, don't patch around it: propose fixing the root cause properly.

## Code comments

- Hebrew only, short. Code, names and identifiers stay English.
- The default is no comment. Write one only to explain *why*: a chosen approach, an external constraint (Mongo, Cloudinary, payments), or a non-obvious side effect.

## Images

Course images (`courseImage`, `images`) are stored only on Cloudinary. The admin form uploads directly from the browser with a signature from `POST /media/signature`; `courses.controller.js` rejects any URL that isn't from our Cloudinary account.

## Domain rules

- Course status (`draft`/`available`/`notAvailable`/`archived`) changes only through `PUT /courses/:id/status` with an action from `allowedTransitions` in `courses.controller.js`; the regular `put` rejects `status`. Hard delete is allowed only for `draft`, and only `available` courses can be ordered.
- Mongo `_id` is the id field used throughout, on both server and client.

## Commits

Commits, branches and PRs follow the `ship` skill (`.claude/skills/ship/SKILL.md`).
