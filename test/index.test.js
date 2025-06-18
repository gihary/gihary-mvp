const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

test('prints Hello World when onboarding skipped', () => {
  const script = path.join('src', 'index.js');
  const result = spawnSync(process.execPath, [script], {
    encoding: 'utf-8',
    env: { ...process.env, SKIP_ONBOARDING: '1' },
  });
  assert.strictEqual(result.stdout.trim(), 'Hello World');
});
