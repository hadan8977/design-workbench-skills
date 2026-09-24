import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('../skills/quality-score/scripts/score-ticket.mts', import.meta.url));
type Example = { name: string; args: string[]; stdout: string };
const examples: Example[] = JSON.parse(readFileSync(new URL('./fixtures/score-ticket.json', import.meta.url), 'utf8'));

function run(args: string[]) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: tmpdir(), encoding: 'utf8', timeout: 10_000,
  });
}

for (const example of examples) {
  test(`matches the previous CLI: ${example.name}`, () => {
    const result = run(example.args);
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');
    assert.equal(result.stdout.replaceAll('\r\n', '\n'), example.stdout);
  });
}

test('supports help without requiring report fields or writing a report', () => {
  for (const flag of ['--help', '-h']) {
    const result = run([flag]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /^Usage: node score-ticket\.mts/);
    assert.doesNotMatch(result.stdout, /SLOP COP REPORT CARD/);
  }
});

const required = ['--recipient', 'Dashboard', '--offense', 'Clutter', '--evidence', 'Duplicate labels', '--fix', 'Remove duplication'];
for (const args of [[], [...required, '--notes=-1'], [...required, '--notes=1.5'],
  [...required, '--notes=1e3'], [...required, '--notes='], [...required, '--notes=1__0'],
  [...required, '--unknown'], [...required, 'unexpected']]) {
  test(`rejects invalid arguments: ${JSON.stringify(args.slice(-2))}`, () => {
    const result = run(args);
    assert.equal(result.status, 2);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /^score-ticket: /);
  });
}
