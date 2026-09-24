# Design Workbench skill map

This is the shared routing and conflict policy for Design Workbench. Read the relevant row, then only the resources needed for the task. It is not an instruction to load every skill.

Repository instructions use English. Deliver the user's work in their requested language and preserve quotations, identifiers, and meaningful multilingual content. Skill names use `<domain>-<purpose>`; invocation prefixes and tools come from the host.

## Responsibility

| Need | Lead | Supporting resources |
| --- | --- | --- |
| Design a new interface, substantial redesign, or plan a user journey | [design-lead](../SKILL.md) | [new-work](new-work.md), then relevant specialists |
| Review whether a design meets its goals | [design-lead critique](critique.md) | Actual render, task walkthrough, [craft floor](craft-floor.md) |
| Find a palette, type pairing, UX rule, chart, or implementation pattern | [design-reference](../../design-reference/SKILL.md) | A focused local query; results are candidates |
| Examine generic or unsupported UI choices | [design-review](../../design-review/SKILL.md) | [design-purpose](../../design-purpose/SKILL.md) for the purpose test |
| Simplify a task-oriented screen or dense controls | [design-simplify](../../design-simplify/SKILL.md) | Preserve the selected identity and task structure |
| Integrate compact React actions and honest async feedback | [design-interaction](../../design-interaction/SKILL.md) | Selected source primitive and component map |
| Select or implement glass, fluid color, or shaders | [design-material](../../design-material/SKILL.md) | Material references and lifecycle requirements |
| Produce a requested raster asset or visual concept | An available image-generation tool or skill | Use the host's capability; native vectors and UI stay native |
| Edit prose while retaining the writer's voice | [writing-edit](../../writing-edit/SKILL.md) | [writing-tighten](../../writing-tighten/SKILL.md) for a short cleanup pass |
| Apply the detailed writing catalog or its detector | [writing-audit](../../writing-audit/SKILL.md) | Preserve its existing explicit invocation policy |
| Produce a scored audit or humorous quality ticket | [quality-score](../../quality-score/SKILL.md) | Its scoring tool and ticket references |

A specialist request goes directly to that specialist. A local spacing fix does not start discovery. UI labels and errors stay in the design task; a separate writing pass is useful only when copy quality is a material concern. Choose one prose editor rather than running several serial rewrites.

## Resolve disagreements by scope and evidence

- User instructions, repository constraints, product truth, and the requested scope remain authoritative. Reuse decisions and authorization already supplied.
- The approved brief and visual direction govern style. Existing tokens and components govern refinements; an authorized redesign can replace their visual treatment.
- Functional integrity, readable content, discoverable actions, honest states, keyboard access, and applicable accessibility requirements are acceptance criteria.
- Aesthetic catalogs, search results, sample palettes, and past projects are suggestions. A font, radius, gradient, icon library, serif, eyebrow, or animation is not a defect by itself.
- Evaluate a specific choice against its purpose and visible effect. Report a conflict with the brief or a usability consequence, not merely a match in a ban list.
- When the brief leaves a choice open, the lead makes and explains a coherent decision. Ask only when missing information materially changes the outcome. Do not require repeated approval of settled decisions.
- General and specialist reviews contribute to one findings list. Keep the original design goal during fixes and avoid a second redesign caused by a reviewer's taste.

Case studies are examples, not global defaults. A preference inferred from one example is weaker than an explicit brief.

## Proportional workflow

For new work use discovery, reference study, concept exploration, composition, prototype, and critique from [new-work](new-work.md). For refinements inspect and fix the relevant relationships. Analysis and review remain read-only unless changes were requested.

Do not make setup wizards, random concept selection, a particular rendering tool, multiple agents, numeric scores, persistent reports, or repeated confirmation prerequisites for ordinary design work. Use a tool workflow when it adds needed evidence or the user requests it. Follow that tool's real technical preconditions; do not claim to have run a detector, browser, or test that was unavailable.

Specialist references supply techniques within this policy. Explicit tool commands retain their technical instructions; their presence does not authorize installation, publishing, git changes, paid operations, or unrelated artifacts.

## One record of the design

Reuse the project's existing product and design records. For a substantial new direction, record the chosen rationale, reference sources, and reusable decisions in that established location. Do not maintain a competing token specification in both DESIGN.md and a generated design-system/MASTER.md.

Carry forward what worked, the highest-impact changes, and the evidence obtained. A source-only review is labeled as such; expert critique does not establish real-user usability or device performance.
