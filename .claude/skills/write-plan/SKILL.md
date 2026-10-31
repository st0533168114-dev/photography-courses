---
name: write-plan
description: Use when planning a feature, fix or refactor before writing code: in plan mode, when the user asks for a plan or "תוכנית", or when a change touches several files or both server and client.
---

# Write a plan

Plan the way an experienced, professional developer would: choose the accepted, industry-standard way to do the thing, verify it against the real code, and split the work into commits that can be tested and reviewed on their own.

## 1. Understand before designing
- Read the code the change touches, along with everything that depends on it: models, controllers, routers, services, API files, slices, the pages that use them. Search for every caller of anything you plan to change or delete.
- Read the rules that apply: `CLAUDE.md` (root, `client/`, `server/`), `.claude/rules/api.md`, `.claude/rules/client/*.md`.
- Check the environment the change runs in, e.g. the database type (transactions need Atlas or a replica set), deployment (Render, Vercel), env vars, external services.

## 2. Design the professional way
- Start from "how is this done properly in a real production system?", not from "what is the smallest change to the current code?". Name the accepted approach and the reason for it, e.g. "payments are created only by the server, from the provider's response".
- **No improvised workarounds.** When the existing code doesn't fit the right design, don't bend the design to keep the code. Propose changing the code: delete a route that shouldn't exist, move a helper into a service, fix a model. Explain why.
- When something is the industry standard but too heavy for this project (e.g. webhooks in a final project), say so honestly. Compare the options in a table: what each one requires, how well it protects, how easy it is to understand. Recommend one option, and leave the decision with the user.
- Put server-decided data and side effects on the server (prices, totals, statuses, granting access, clearing the cart). Never rely on the browser sending a follow-up request.
- Keep scope tight. Issues found along the way that aren't part of the task go into a short "out of scope" list, not into the plan.

## 3. Check for conflicts
Before finalizing, go over the plan and confirm:
- Every changed or deleted function, route and field: all of its callers are updated or are unaffected. Name the ones that are unaffected and say why (e.g. "admin course granting goes through `users.put`, which isn't touched").
- Every change follows the project rules, or the deviation is stated with its reason.
- Model changes are compatible with existing documents in the DB.
- Server and client still agree on every request and response shape.
- New env vars are listed for `.env.example`, Render and Vercel.

## 4. Structure of the plan file
1. **Context**: the problem, why it matters, the goal, and what is out of scope.
2. **Flow**: the steps of the feature, end to end (user → client → server → DB → external service).
3. **Changes**: by area (server / client), file by file, with what changes and why. Link existing functions to reuse.
4. **Setup the user must do**: accounts, keys, env vars.
5. **Execution stages** (see 5).
6. **Verification**: concrete end-to-end checks, including failure paths (cancel, duplicate request, wrong owner).
7. **Open decisions**: questions to ask the user before finishing.

## 5. Stages
- Split into a small number of stages, **one commit each**, by logical unit and not by file. For example: 1. separate security fix, 2. server side, 3. client side, 4. docs and open decisions. All stages go on one branch and one PR (see the `ship` skill).
- Each stage lists its files and **its own test**. Note any stage that leaves the app temporarily broken, and why that's acceptable (e.g. the PR is merged only at the end).
- Execution workflow, written into the plan:
  1. Do the whole stage, without stopping for approval between files.
  2. Run the stage's test (and `npm run lint` for client stages).
  3. Stop for diff review: open the changed files in VS Code and commit only after the user approves.
  4. Stop in the middle of a stage only if something doesn't match the plan: explain what and wait.
- Test steps that need the user (e.g. logging in to a sandbox account) are marked. Tests that write to the real DB report what they created.

## 6. Where to save
- Save the plan in `.claude/plans/<topic>.md` (kebab-case topic, e.g. `paypal-payments.md`). The project's `plansDirectory` setting points there, and the folder is not in git.
- Add a **"מצב נוכחי"** section at the top while work is in progress: branch, what's done, what's next, any stash. Update it whenever work stops, so a new conversation can continue from it.

## 7. Talking to the user
- The plan and all explanations are in Hebrew, simple, with concrete examples from this project's code.
- Ask questions in plain text at the end of the message, not with multiple-choice popups.
- When the user says "לא הבנתי", explain differently (a story or the actual code before and after) instead of repeating.
