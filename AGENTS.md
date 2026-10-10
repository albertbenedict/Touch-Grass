# AGENTS.md — Touch Grass Quest

## What this is
A mobile-first static web game (DEV Hacktoberfest Open-Source AI Challenge
entry, Week 1 "Touch Grass"). Players get outdoor quests, photograph them with
the in-app live camera, and an on-device AI verifies the photo. Correct photos
earn XP, which grows a plant. No backend, no accounts, no build step.

## Hard constraints
- Vanilla HTML/CSS/JS only. No frameworks, bundlers, npm dependencies, or
  build step. Keep the pinned transformers.js CDN import as it is.
- Must work on GitHub Pages under a sub-path
  (`https://<user>.github.io/Touch-Grass/`). Relative URLs only, never
  absolute `/...` paths.
- Do not change game balance (XP values, thresholds, pool sizes) or the visual
  design unless explicitly asked.
- Small, reviewable changes. Do not rewrite whole files or delete unasked
  things. One small commit per task with a clear message.

## File layout
- `index.html` — the whole app (markup, game logic in one inline module script)
- `styles.css` — all styling, linked from `index.html`
- `sw.js` — service worker: precaches the app shell, network-first for
  same-origin files, cache-first for `cdn.jsdelivr.net`; model files on
  huggingface.co are left to transformers.js caching
- `manifest.webmanifest` — PWA manifest (`start_url: "./"`)
- `icon.svg` — app icon

## Models (open-weight, on-device via transformers.js)
- CLIP (`Xenova/clip-vit-base-patch32`): zero-shot photo verification.
- Small LLM (`onnx-community/gemma-3-270m-it-ONNX`, `Qwen2.5-0.5B` fallback):
  rewrites quest text; template fallback if it fails.
- Live camera only; gallery upload exists only under `?dev`.

## Run locally
`python -m http.server 8000`, then open `http://localhost:8000/?dev`
(`?dev` skips waits and enables file upload for testing).

## State compatibility (load-bearing rule)
Progress lives in localStorage under the key `"tgq"`. Never rename the key.
Only extend the saved state shape in an additive, backward-compatible way —
old saves must keep loading and working.
