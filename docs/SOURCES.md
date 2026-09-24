# Sources and skill lineage

Design Workbench coordinates locally adapted skills and supporting resources. Renaming a skill identifies its role in this collection; it does not transfer authorship or rename an upstream engine.

## Skill lineage

| Current skill | Previous local name | Source or attribution | Included notice |
| --- | --- | --- | --- |
| `design-lead` | `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable), with a locally adapted lead workflow | [Apache-2.0](../skills/design-lead/LICENSE), [third-party notices](../skills/design-lead/NOTICE.md) |
| `design-reference` | `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), with local search guidance | [MIT](../skills/design-reference/LICENSE) |
| `design-review` | `avoid-ai-design` | [funboy322/avoid-ai-design](https://github.com/funboy322/avoid-ai-design); copyright ungspirit | [MIT](../skills/design-review/LICENSE) |
| `design-purpose` | `antislop` | Locally curated purpose check; no separate upstream attribution was recorded in the exported folder | No additional license asserted |
| `design-simplify` | `uncodixfy` | [cyxzdev/Uncodixfy](https://github.com/cyxzdev/Uncodixfy), with a locally scoped task-UI entrypoint | [MIT](../skills/design-simplify/LICENSE) |
| `design-interaction` | `beautiful-ui` | Local adaptation of [slev12397/beautiful-ui](https://github.com/slev12397/beautiful-ui) patterns and React primitives | [Component MIT notice](../skills/design-interaction/assets/react/LICENSE) |
| `design-material` | `liquid-materials` | Locally curated guidance; sources are recorded in its [component map](../skills/design-material/references/component-map.md) | External components retain their own terms |
| `writing-edit` | `no-ai-slop` | Locally curated prose editor; no separate upstream attribution was recorded in the exported folder | No additional license asserted |
| `writing-tighten` | `stop-slop` | Hardik Pandya, as identified in the original notice | [MIT](../skills/writing-tighten/LICENSE) |
| `writing-audit` | `avoid-ai-writing` | [conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing), with local routing and invocation scope | [MIT](../skills/writing-audit/LICENSE) |
| `quality-score` | `slop-cop` | [howshannon/slop-cop](https://github.com/howshannon/slop-cop), with local routing, review scope, and a TypeScript port of the scoring helper | [MIT](../skills/quality-score/LICENSE) |

Original READMEs and launch materials retained inside skill folders are upstream historical documents. Their names, branding, installation commands, and project claims describe the upstream distribution. The collection README, current `SKILL.md` entrypoints, and shared skill map govern this distribution.

## Runtime ownership

The collection maintains its scoring helper in TypeScript and uses TypeScript for new command-line tools. The port retains the original scoring behavior, report text, slogan data, and MIT attribution; regression fixtures were captured from `score_ticket.py` at collection commit `ff75d3f`.

The following imported implementations retain their original languages and upstream notices:

- `design-lead/scripts/`: Impeccable browser code, launcher scripts, and supporting engine resources.
- `design-reference/scripts/`: the Python search engine, data checks, and associated upstream tests.
- `writing-audit/detector/` and `writing-audit/scripts/`: JavaScript detectors and writing utilities.

These paths are marked `linguist-vendored`. Historical `design-review` demonstrations and launch materials are marked `linguist-documentation`. This makes GitHub's language chart describe the maintained code rather than the size of imported tools; it does not remove their runtime requirements. Revisit a path's classification if the collection takes over substantial independent development of that code.

## Documentation references

The following primary repositories informed the presentation, installation guidance, and maintenance structure. Counts and activity are a dated observation, not a claim about this collection's adoption or design quality.

| Reference | GitHub stars on 2026-09-24 | Repository push date observed | Principle used here |
| --- | ---: | --- | --- |
| [Impeccable](https://github.com/pbakaus/impeccable) | 70,487 | 2026-09-24 | Clear positioning, a quick start, command discoverability, and separate optional runtime details |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 130,214 | 2026-09-21 | A browsable capability catalog, concrete examples, installation choices, and source attribution |
| [Anthropic Skills](https://github.com/anthropics/skills) | 177,861 | 2026-09-22 | Consistent skill directories and clear distinctions between examples, capabilities, and licenses |

Repository push timestamps indicate recent repository activity; they are not evidence that a particular skill changed on that date. The [Agent Skills specification](https://agentskills.io/specification) defines the portable format. The [Vercel Skills CLI documentation](https://github.com/vercel-labs/skills) is the source for the installer flags and supported agent selection.

## Local adaptations

The collection adds coordinated responsibility boundaries, a product-and-reference-led design workflow, scoped specialist entrypoints, common English naming, and portable host-capability guidance. These changes are maintained here rather than presented as upstream features.

Preserve original notices when redistributing individual resources. Catalog data, embedded components, reference images, and engine code may have different origins; a skill's current name is not a collection-wide license grant.
