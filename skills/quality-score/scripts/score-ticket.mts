#!/usr/bin/env node
// Adapted from howshannon/slop-cop's score_ticket.py; see ../LICENSE.
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

type Severity = 'blockers' | 'majors' | 'minors' | 'notes';
type Counts = Record<Severity, bigint>;
type Slogans = { bad: string[]; good: string[] };

const HELP = `Usage: node score-ticket.mts --recipient TEXT --offense TEXT --evidence TEXT --fix TEXT
                             [--blockers N] [--majors N] [--minors N] [--notes N]

Create a deterministic report card. Counts must be nonnegative integers.
Use --help or -h to show this message.`;

function nonnegative(value: string): bigint {
  const normalized = value.trim();
  if (!/^[+-]?[0-9](?:_?[0-9])*$/.test(normalized)) {
    throw new Error(`Invalid violation count: ${JSON.stringify(value)}; expected an integer.`);
  }
  const parsed = BigInt(normalized.replaceAll('_', ''));
  if (parsed < 0n) throw new Error('Violation counts cannot be negative.');
  return parsed;
}

function score(counts: Counts): number {
  const deduction = counts.blockers * 30n + counts.majors * 15n
    + counts.minors * 5n + counts.notes;
  return Number(deduction >= 100n ? 0n : 100n - deduction);
}

function letterGrade(value: number): string {
  const bands: [number, string][] = [
    [97, 'A+'], [93, 'A'], [90, 'A-'], [87, 'B+'], [83, 'B'], [80, 'B-'],
    [77, 'C+'], [73, 'C'], [70, 'C-'], [67, 'D+'], [63, 'D'], [60, 'D-'], [0, 'F'],
  ];
  return bands.find(([floor]) => value >= floor)![1];
}

function nextStep(value: number): string {
  if (value >= 97) return 'Ship it. No material revision is required.';
  if (value >= 90) return 'Tweak the optional notes, then ship.';
  if (value >= 80) return 'Tweak the minor violations before publishing.';
  if (value >= 77) return 'Revise the highest-impact violation, then re-score.';
  if (value >= 70) return 'Revise the material violations before publishing.';
  if (value >= 60) return 'Rewrite the affected sections around concrete facts and structure.';
  return 'Start over from the strongest factual core; preserve only verified details.';
}

function loadSlogans(): Slogans {
  const file = new URL('../references/ticket-slogans.json', import.meta.url);
  // scripts/ and references/ are siblings within the installed skill.
  const data: unknown = JSON.parse(readFileSync(file, 'utf8'));
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('The slogan bank must be an object.');
  }
  const banks = data as Record<string, unknown>;
  if (Object.keys(banks).sort().join(',') !== 'bad,good'
    || !['bad', 'good'].every(key => Array.isArray(banks[key])
      && banks[key].length === 30 && banks[key].every(value => typeof value === 'string'))) {
    throw new Error('The slogan bank must contain exactly 30 strings each for bad and good grades.');
  }
  return banks as Slogans;
}

function main(): void {
  const { values } = parseArgs({
    options: {
      recipient: { type: 'string' }, offense: { type: 'string' },
      evidence: { type: 'string' }, fix: { type: 'string' },
      blockers: { type: 'string', default: '0' }, majors: { type: 'string', default: '0' },
      minors: { type: 'string', default: '0' }, notes: { type: 'string', default: '0' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: false,
    strict: true,
  });
  if (values.help) {
    console.log(HELP);
    return;
  }
  for (const key of ['recipient', 'offense', 'evidence', 'fix'] as const) {
    if (values[key] === undefined) throw new Error(`Missing required option: --${key}`);
  }
  const counts: Counts = {
    blockers: nonnegative(values.blockers), majors: nonnegative(values.majors),
    minors: nonnegative(values.minors), notes: nonnegative(values.notes),
  };
  const value = score(counts);
  const bank = loadSlogans()[value >= 77 ? 'good' : 'bad'];
  // BigInt preserves the original integer arithmetic, including slogan selection.
  const index = Number((BigInt(value) + counts.blockers * 11n + counts.majors * 7n
    + counts.minors * 3n + counts.notes) % BigInt(bank.length));
  const math = `100 - (${counts.blockers}×30 blocker) - (${counts.majors}×15 major) `
    + `- (${counts.minors}×5 minor) - (${counts.notes}×1 note) = ${value}`;
  console.log([
    '🚨 SLOP COP REPORT CARD',
    `To: ${values.recipient}`,
    `Score: ${value}/100 (${letterGrade(value)})`,
    "Scale: 0 = total slop · 100 = damn, you're not a robot?",
    `Charge: ${values.offense}`,
    `Evidence: ${values.evidence}`,
    `Violations: ${counts.blockers} blocker · ${counts.majors} major · ${counts.minors} minor · ${counts.notes} note`,
    `Score math: ${math}`,
    `Citation: ${bank[index]}`,
    `Recommended next step: ${nextStep(value)}`,
    `Fix: ${values.fix}`,
  ].join('\n'));
}

try {
  main();
} catch (error) {
  console.error(`score-ticket: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 2;
}
