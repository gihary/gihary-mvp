const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

function createFakeFirestore() {
  const store = {};
  return {
    store,
    collection() {
      return {
        doc(userId) {
          return {
            collection() {
              return {
                async add(data) {
                  store[userId] = store[userId] || [];
                  store[userId].push(data);
                  return { id: String(store[userId].length) };
                },
              };
            },
          };
        },
      };
    },
  };
}

test('logEvent stores action, metadata and timestamp', async () => {
  const fakeDb = createFakeFirestore();
  process.env.FIREBASE_ADMIN_KEY_PATH = path.resolve(__dirname, 'fixtures', 'serviceAccount.json');
  delete require.cache[require.resolve('../src/firestore')];
  const { setFirestore } = require('../src/firestore');
  setFirestore(fakeDb);

  delete require.cache[require.resolve('../src/logger')];
  const { logEvent } = require('../src/logger');

  await logEvent('user1', 'test-action', { foo: 'bar' });

  const events = fakeDb.store['user1'];
  assert.strictEqual(events.length, 1);
  const event = events[0];
  assert.strictEqual(event.action, 'test-action');
  assert.deepStrictEqual(event.metadata, { foo: 'bar' });
  assert.ok(event.timestamp);
});
