# Agent Guidance

## Project overview

- This repository contains standalone HTML tools for EVE Online, intended to be opened locally in a web browser.
- The tools use HTML and JavaScript. Keep each tool self-contained; there is no application build system or package manifest.
- ESI-backed tools make browser `fetch` requests and support importing and exporting JSON. Preserve their local-file workflow.

## Changes

- Follow the existing HTML structure and JavaScript style. Prefer small changes that fit the tool being updated.
- Keep user-visible failures explicit; do not silently discard fetch, validation, or import errors.
- When changing tool behavior, update or add focused tests in `tools/tests/`.
- The tests load each HTML file's inline script in a mocked browser context. Keep logic testable in that environment where practical.
- Treat files in `prompts/` as historical/reference material unless a task specifically asks to update them.

## Validation

- Run the full test suite with `node --test tools/tests/*.js`.