# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Hi-Lo is a single-file static web game hosted on GitHub Pages at `https://cshunnarah.github.io/hilo/`. The player sees a random number (1–100) and guesses whether the next number will be higher or lower. A wrong guess ends the game.

There is no build step, no package manager, and no framework — the entire game is `index.html`.

## Serving locally

Use any static file server from the repo root:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Architecture

**`index.html`** — the whole game. All CSS, HTML, and JS are inline in one file. Key sections:

- **`SCRIPT_URL`** (top of `<script>`) — empty string by default. Paste the Google Apps Script web app URL here to enable leaderboard saving and fetching. Without it, the leaderboard panel is inert and the name-entry form is skipped.
- **Daily limit** — tracked via `localStorage` keys `hilo-play-date` (ISO date string) and `hilo-play-count` (integer). `MAX_PLAYS = 5`. The limit resets automatically when the date changes. On the 5th game over, the "Get back to work!" screen replaces the normal game-over UI.
- **Leaderboard** — reads/writes via HTTP GET to the Apps Script URL with `?action=top` and `?action=save&name=…&score=…`. Uses `mode: 'no-cors'` for writes (fire-and-forget) and a 1.5 s delay before re-fetching the top 3 after saving.
- **Best streak** — persisted in `localStorage` under `hilo-best`.

**`apps-script.js`** — Google Apps Script code to paste into a bound Apps Script project on a Google Sheet. Exposes a `doGet` web app endpoint that handles both `action=save` (append a row) and `action=top` (return top 3 scores as JSON). Deploy as "Execute as: Me / Who has access: Anyone".

## Deployment

Pushing to `main` automatically updates the live site via GitHub Pages (configured at repo root, `main` branch). There is no CI.
