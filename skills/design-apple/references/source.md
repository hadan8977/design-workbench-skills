# Source and adaptations

- Upstream: [ttyineworld/yu-apple](https://github.com/ttyineworld/yu-apple), Yu Apple / 宇苹果 by 廷宇.
- Imported version: 0.1.0, commit `0706a6107311233d8541899fa8a4dfb06f5a0dd5`.
- License: [MIT](../LICENSE), copyright 2026 廷宇; preserved unchanged.
- Unmodified imports: `scripts/deck.mjs`, `assets/template.html`, `assets/skill-icon.svg`, `package.json`, and `package-lock.json`.
- Maintained here: English entrypoint, interface metadata, condensed visual/narrative/tooling references, and collection routing. These adapt upstream deck DNA, voice and copy, page archetypes, full-deck workflow, tooling, and QA. Website/interface application is a local adaptation coordinated by Design Lead, not a claim that upstream implements an application framework.

The retained dependency package name `yu-apple` identifies the upstream renderer. The installed skill is `design-apple`, following the collection's domain-purpose convention. The original installer is omitted because it manages a separate skill and cannot update this adaptation. The original repository retains upstream examples and history.

No commercial fonts, customer data, third-party photos, or Apple brand assets are bundled. The template contains demonstration content. Runtime dependencies retain their own licenses: Playwright and sharp use Apache-2.0; pdf-lib uses MIT. The lockfile records the dependency tree. Chromium, fonts, and future project assets have separate terms and provenance requirements.

Apple describes an aesthetic here. Neither this collection nor Yu Apple is affiliated with Apple Inc.; this guidance does not establish platform HIG compliance.
