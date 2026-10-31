---
name: ship
description: Commit, push and open a PR in this repo following the user's conventions. Use whenever the user asks to commit, push, open a PR, or "ship" a change, and after a PR is merged.
---

# Ship a change

Run git commands from the repo root. Before running any command that changes git state, show the commands with a one-line explanation each and wait for approval.

## 1. Check the state
- `git status --short` and `git branch --show-current`
- Another Claude session may share this working directory: if the current branch isn't the expected one, or there are changes you didn't make, stop and tell the user before doing anything
- `.claude/plans/` and `.claude/settings*.json` are personal and git-ignored; never commit them

## 2. Branch
Every change, even a small one, goes on its own branch created from an up-to-date `main`:
- `git switch main` → `git pull` → `git switch -c <type>/<topic>`
- `<type>`: `feat`, `fix` or `chore`; `<topic>`: short kebab-case, e.g. `fix/error-responses`

## 3. Commit
- Add files by name, never `git add .` or `-A`. Deleted files are added by name too
- One commit per topic; if the changes cover two unrelated things, make two commits
- Message — subject line only, no body:
  - Format: `type(scope): summary`, e.g. `feat(cart): handle course availability and block checkout for unavailable items`
  - Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `chore`
  - Scope: the domain (`courses`, `orders`, `cart`, `users`, `auth`, `admin`, `categories`) or the app (`client`, `server`); omit it when the change spans the whole repo
  - Summary: lowercase, imperative ("add", not "added"), no period, says what changes for the user rather than which files were edited; join two related changes with "and"

## 4. Push and PR
- `git push -u origin <branch>`
- `gh pr create --base main --head <branch> --title "<title>" --body "<body>"`
  - If `gh` isn't found, use `& "C:\Program Files\GitHub CLI\gh.exe"`
  - Title: the commit message, or for several commits a `type: summary` covering them
  - Body:
    ```
    ## Summary
    - <what changed, one line per change>

    ## Notes
    - <anything the reviewer should know; omit the section if empty>
    ```
- Don't merge. Give the user the PR link; they review and merge on GitHub

## 5. After the user merged
- `git switch main` → `git pull`
- `git branch -d <branch>` (`-d` refuses to delete an unmerged branch)
