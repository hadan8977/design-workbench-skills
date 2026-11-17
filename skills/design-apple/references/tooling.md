# Optional Yu Apple deck tools

The bundled renderer, template, icon, and dependency manifests are imported from Yu Apple. They support presentations, not website rendering or editable PPTX. Planning and visual guidance need no runtime installation.

Resolve `<skill-dir>` to the absolute directory containing this skill's `SKILL.md`. Do not assume the current project is the skill directory. Use absolute project input/output paths. Keep generated artifacts and dependencies out of commits.

## Setup

For rendering or export, the imported package requires Node.js 20.9+ and pinned Playwright, sharp, and pdf-lib dependencies. The collection's maintained TypeScript tools have their separate Node requirement in the collection README.

From `<skill-dir>`, run `npm ci`, then `npx playwright install chromium` if that browser is absent. Follow the host's real installation policy. Linux can require browser system libraries; diagnose actual errors. Fonts are separate resources, and substitution can change wrapping.

## HTML contract

Copy `assets/template.html` into the project and replace demonstration content; it is not user evidence.

- Each `.slide` is inside `.viewport`, with a unique `data-page`.
- Logical pages are 1920×1080; page count follows content.
- `window.yuDeck.show(index)` selects a zero-based page; `window.yuDeck.fit()` fits it.
- `body.capture` hides navigation and its reserved space for export.
- Use native HTML text and SVG relationships where useful. Images use relative or embedded resources, with provenance records.

## Commands

```sh
node "<skill-dir>/scripts/deck.mjs" --help
node "<skill-dir>/scripts/deck.mjs" check --input "/absolute/project/deck.html" --out "/absolute/project/output/check"
node "<skill-dir>/scripts/deck.mjs" render --input "/absolute/project/deck.html" --out "/absolute/project/output/preview"
node "<skill-dir>/scripts/deck.mjs" render --input "/absolute/project/deck.html" --out "/absolute/project/output/preview" --pages 1,3 --scale 2
node "<skill-dir>/scripts/deck.mjs" pdf --input "/absolute/project/deck.html" --out "/absolute/project/output/final"
```

On Windows use absolute Windows paths. `check` writes a page/resource report. `render` exports pages and an overview: 1920×1080 by default, 3840×2160 with `--scale 2`. `--pages` uses one-based positions and only applies to rendering. A complete overview requires a valid full-page cache; never mix versions. Overview resolution is independent of single-page resolution.

`pdf` exports the full deck at 16:9 on a 4K-equivalent canvas. Native text and vectors retain their resolution independence. A gradient-text workaround may locally rasterize text at higher resolution to avoid Chromium clipping artifacts; it cannot create detail in source photos.

Wait for fonts and images. Printing must show all pages, apply page breaks, and hide navigation. Inspect the final PDF separately using an available viewer or renderer. Poppler is optional, not an npm dependency: `pdftoppm -r 96 -png <pdf> <output-prefix>`. If no suitable viewer or renderer exists, report the missing PDF visual verification.

The tool opens local HTML; remote assets inside it can still make network requests. It does not upload or publish the deck. Use the host's actual mechanisms to show or deliver files; rendering alone does not mean the user has seen the result.
