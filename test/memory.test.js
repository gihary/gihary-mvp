const test = require('node:test');
const assert = require('node:assert');
const memory = require('../src/memory');

test('memory stores and retrieves messages', async () => {
  await memory.addMessage('user1', 'user', 'hello');
  const msgs = await memory.getMessages('user1');
  assert.deepStrictEqual(msgs, [{ role: 'user', content: 'hello' }]);
  await memory.clear('user1');
  const empty = await memory.getMessages('user1');
  assert.deepStrictEqual(empty, []);
});
