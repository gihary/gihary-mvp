import test from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

// Ensure that running the main module prints "Hello World"
test('prints Hello World from main module', () => {
  const script = path.join('src', 'index.js');
  const result = spawnSync(process.execPath, [script], { encoding: 'utf-8' });
  assert.strictEqual(result.stdout.trim(), 'Hello World');
});
