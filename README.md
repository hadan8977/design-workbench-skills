# Codex Design Skills

A curated collection of 11 design and writing skills, coordinated through one shared routing and conflict policy. The collection supports product framing, visual research, concept exploration, interface implementation, critique, and clear writing.

The skills are locally adapted versions and companion resources, not an official distribution of their upstream projects. The initial collection was exported on 2026-09-24.

## Start here

Read the [skill map](skills/impeccable/reference/skill-map.md) to choose the right lead and supporting resources. It is the single source for responsibility boundaries and conflict resolution; ordinary tasks do not require loading every skill.

| Skill | Responsibility |
| --- | --- |
| [impeccable](skills/impeccable/SKILL.md) | Lead product-aware design, visual research, concepts, composition, implementation, and critique |
| [ui-ux-pro-max](skills/ui-ux-pro-max/SKILL.md) | Search local references for a specific design or implementation decision |
| [avoid-ai-design](skills/avoid-ai-design/SKILL.md) | Examine generic UI choices against the actual brief and rendered evidence |
| [antislop](skills/antislop/SKILL.md) | Check whether a design or copy choice has a useful purpose |
| [uncodixfy](skills/uncodixfy/SKILL.md) | Simplify cluttered task interfaces while preserving their identity |
| [beautiful-ui](skills/beautiful-ui/SKILL.md) | Adapt compact React interactions and truthful async feedback |
| [liquid-materials](skills/liquid-materials/SKILL.md) | Select and implement glass, fluid color, and shader materials |
| [no-ai-slop](skills/no-ai-slop/SKILL.md) | Edit prose while preserving facts, uncertainty, and voice |
| [stop-slop](skills/stop-slop/SKILL.md) | Make a short, minimal prose cleanup |
| [avoid-ai-writing](skills/avoid-ai-writing/SKILL.md) | Apply the detailed writing rulebook when explicitly selected |
| [slop-cop](skills/slop-cop/SKILL.md) | Produce requested quality grades, tickets, or scoped audits |

For substantial interface work, start with the [design workflow](skills/impeccable/reference/new-work.md). For analysis without implementation, use [shape](skills/impeccable/reference/shape.md); for a review, use [critique](skills/impeccable/reference/critique.md).

## Install

Clone this repository with an account that can access it:

```sh
gh repo clone hadan8977/codex-design-skills
cd codex-design-skills
```

Copy the folders inside `skills/` into `$CODEX_HOME/skills`, or `~/.codex/skills` when `CODEX_HOME` is unset. Preserve the sibling folder names so the relative links between skills continue to work. Copy each whole folder, including its references, scripts, data, assets, and license notices.

The following Python snippet, run from the repository root, installs the collection without replacing existing skill folders:

```python
import os
import shutil
from pathlib import Path

source = Path.cwd() / "skills"
destination = Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex"))) / "skills"
folders = sorted(entry.parent for entry in source.glob("*/SKILL.md"))
if not folders:
    raise SystemExit("Run this from the repository root.")
conflicts = [folder.name for folder in folders if (destination / folder.name).exists()]
if conflicts:
    raise SystemExit("Existing skills need a manual comparison: " + ", ".join(conflicts))
destination.mkdir(parents=True, exist_ok=True)
for folder in folders:
    shutil.copytree(folder, destination / folder.name,
                    ignore=shutil.ignore_patterns("__pycache__", "*.pyc", "node_modules"))
print(f"Installed {len(folders)} skills into {destination}")
```

These skills were already installed on the source workstation. Exporting this repository does not replace that installation. To update another existing installation, compare and merge the affected folders deliberately.

## Use

Examples of focused requests:

- `Use $impeccable to review this dashboard against its intended tasks. Analyze only.`
- `Use $impeccable to explore distinct visual directions, select one, and implement the requested screen.`
- `Use $ui-ux-pro-max to find chart patterns for comparing an experiment with its baseline.`
- `Use $no-ai-slop to edit this draft while preserving its factual claims and voice.`

The host's available tools determine whether browser inspection, image generation, or code execution can run. The host-provided `imagegen` skill is optional and is not bundled. Optional helper scripts retain the runtime requirements described in their own skills; installing the folders does not install an engine, browser, package dependency, or hook.

`avoid-ai-writing` retains its explicit-invocation policy. The presence of specialist tools does not require running all of them for a design task.

## Packaging and sources

The collection includes the installed skill content and supporting resources. Machine caches, credentials, session history, and unrelated system skills are excluded. Two links to a workstation-specific `imagegen` location have been replaced with portable host-capability references.

Existing licenses and attribution have been preserved. Additional upstream license texts are included for [Impeccable](https://github.com/pbakaus/impeccable), [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), [Avoid AI Writing](https://github.com/conorbronsdon/avoid-ai-writing), and [Slop Cop](https://github.com/howshannon/slop-cop), whose installed folders did not contain those notices. Other source references and component notices remain alongside their resources.

The coordinated entrypoints, shared skill map, and design workflow are local adaptations. Upstream READMEs describe their original projects; use the local `SKILL.md` entrypoints and shared skill map for this collection's behavior. There is no collection-wide license that overrides the licenses of included material.
