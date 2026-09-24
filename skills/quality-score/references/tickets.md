# Report-card tickets

Every Slop Cop response includes a report-card ticket, regardless of mode or
score. A clean review receives a positive ticket; findings receive a violation
ticket. The joke targets the work, never the person.

## Deterministic scoring

Start at 100 and deduct each observable violation once, at its highest
applicable severity:

| Severity | Deduction | Use for |
|---|---:|---|
| Blocker | 30 | Fabrication, dangerous failure, or material meaning change |
| Major | 15 | Unsupported authority, repeated structural pattern, or material omission |
| Minor | 5 | Local wording, clarity, accessibility, or implementation defect |
| Note | 1 | Optional polish with no material impact |

Clamp the result at zero. Always show the counts and arithmetic. The score
measures observable editorial, design, or code quality—not human or AI
authorship.

## Grade bands

| Grade | Score | Grade | Score |
|---|---:|---|---:|
| A+ | 97–100 | C | 73–76 |
| A | 93–96 | C- | 70–72 |
| A- | 90–92 | D+ | 67–69 |
| B+ | 87–89 | D | 63–66 |
| B | 83–86 | D- | 60–62 |
| B- | 80–82 | F | 0–59 |
| C+ | 77–79 |  |  |

Scores below C+ use the bad-grade bank; C+ and above use the good-grade bank.
Both banks contain exactly 30 authored slogans in
[`ticket-slogans.json`](ticket-slogans.json). Never invent a new slogan.
Selection is deterministic:

```text
(score + blockers×11 + majors×7 + minors×3 + notes) modulo 30
```

## Required output

Run `node "<skill-dir>/scripts/score-ticket.mts"` with the violation counts and evidence. The
default request “slop cop this” uses this same output; Ticket is not a separate
requirement.

Use Node.js 22.18+ on the 22.x line, or Node.js 24+. The script resolves its
slogan data relative to its own file and can run from the user's project directory.

```sh
node "<skill-dir>/scripts/score-ticket.mts" --recipient "Dashboard" \
  --offense "Repeated labels" --evidence "Two labels describe one action." \
  --fix "Keep the clearer label." --minors 1
```

```text
🚨 SLOP COP REPORT CARD
To: <recipient or artifact>
Score: <0–100>/100 (<letter grade>)
Scale: 0 = total slop · 100 = damn, you're not a robot?
Charge: <specific offense or no citation-worthy violations found>
Evidence: <quoted or observable evidence>
Violations: <counts by severity>
Score math: <100 minus fixed deductions>
Citation: <fixed deterministic slogan>
Recommended next step: <fixed action for score band>
Fix: <smallest useful correction>
```

If there are no violations, use zero counts, a score of 100, and identify the
evidence that supports the clean result.

Generate a ticket for copying by default. Sending it through Slack, email,
GitHub, or another external service requires an explicit send request and a
resolved recipient.
