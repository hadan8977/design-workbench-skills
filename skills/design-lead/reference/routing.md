# Command guidance

## Workflow questions

Give advice without executing commands; the menu below is only for bare invocations. Consult relevant command references as needed for prerequisites and scope. Link to the [docs](https://impeccable.style/docs/) for the broader workflow guide. If the user also requests execution, follow that request.

## No-argument routing: the context-aware menu

Read this when the user invokes design-lead without a task. Use the host's native invocation syntax when giving examples. Reuse the conversation, product context, and visible target; ask one useful question if there is no target or intent to work from.

Offer 2-3 relevant next actions with a reason grounded in that context. A new surface may need product framing or reference research; an existing screen may benefit from critique or a focused refinement. A missing PRODUCT.md does not mean the conversation or repository lacks product context. Present the full command catalog only when requested. A menu request authorizes recommendations; an explicit request to do the work selects the applicable workflow directly.

## Optional engine signals

If the user requests engine-assisted recommendations and the upstream Impeccable engine is already configured, read [runtime notes](runtime.md), then run `<skill-dir>/scripts/impeccable signals` once. Do not assume setup or `impeccable context` has already run. Do not download an engine or create project records merely to populate a menu. Without it, make recommendations from the available project evidence.

Reason over the signals; there is no score to obey:

- `setup.hasDesign` false while `setup.hasCode` true → check for existing design records before recommending `document`.
- `critique.latest` is `null` → the engine has no recorded critique; it does not establish that nobody has reviewed the project. Recommend `critique <surface>` when a design review is useful.
- `critique.latest` with a low `score` or non-zero `p0` / `p1` → `polish` (it reads that snapshot as its backlog and closes it when stale or cleared).
- `git.changedFiles` pointing at one surface → scope `audit` or `polish` to those files specifically, naming them.
- `devServer.running` true → `live` and `generate` may be useful when their browser and engine requirements are available. A running server alone does not prove readiness. **`live`, `generate`, and the bundled `impeccable detect` are web-only.** If `setup.platform` is `ios`, `android`, or `adaptive`, don't lead with any of them; the browser overlay and the HTML rule engine don't apply to native app code.
- Otherwise group by intent (build new / improve what's there / iterate visually), tailored to the current surface and `setup.platform`.

If a technical scan is requested, `scan.targets` is non-empty, and the platform is web, the configured engine can run `detect --json` on those paths. Resolve the launcher from this skill's directory and quote each path for the current shell. Scope the scan to the user's target. Treat detector hits as candidates requiring context, not automatic aesthetic defects. If the detector fails or is unavailable, report that limit and use the evidence already available.

Keep recommendations concise and distinguish observations from engine-derived suggestions. Advice alone does not claim that a detector, browser, or review has run.
