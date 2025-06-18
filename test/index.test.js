const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

// Ensure that running the main module prints "Hello World"
test('prints Hello World from main module', () => {
  const script = path.join('src', 'index.js');
  const result = spawnSync(process.execPath, [script], { encoding: 'utf-8' });
  assert.strictEqual(result.stdout.trim(), 'Hello World');
});
