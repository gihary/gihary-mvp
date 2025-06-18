const test = require('node:test');
const assert = require('node:assert');

function clearEnv(keys) {
  for (const k of keys) delete process.env[k];
}

function setEnv(env) {
  Object.assign(process.env, env);
}

test('checkEnv identifies missing variables', () => {
  const required = [
    'GEMINI_API_KEY',
    'GMAIL_CLIENT_ID',
    'GMAIL_CLIENT_SECRET',
    'GMAIL_REDIRECT_URI',
    'FIREBASE_ADMIN_KEY_PATH',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
  ];
  const original = { ...process.env };
  clearEnv(required);
  delete require.cache[require.resolve('../src/debugger')];
  const { checkEnv } = require('../src/debugger');
  const missing = checkEnv();
  for (const key of required) {
    assert.ok(missing.includes(key));
  }
  Object.assign(process.env, original);
});

test('checkEnv passes when all variables set', () => {
  const original = { ...process.env };
  setEnv({
    GEMINI_API_KEY: 'k',
    GMAIL_CLIENT_ID: 'id',
    GMAIL_CLIENT_SECRET: 'secret',
    GMAIL_REDIRECT_URI: 'uri',
    FIREBASE_ADMIN_KEY_PATH: '/tmp/key.json',
  });
  delete require.cache[require.resolve('../src/debugger')];
  const { checkEnv } = require('../src/debugger');
  const missing = checkEnv();
  assert.deepStrictEqual(missing, []);
  Object.assign(process.env, original);
});
