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
                doc() {
                  return {
                    async set(data) {
                      store[userId] = data;
                    },
                    id: 'profile',
                  };
                },
              };
            },
          };
        },
      };
    },
  };
}

test('saveClientProfile stores profile with metadata', async () => {
  const fakeDb = createFakeFirestore();
  process.env.FIREBASE_ADMIN_KEY_PATH = path.resolve(__dirname, 'fixtures', 'serviceAccount.json');
  delete require.cache[require.resolve('../src/firestore')];
  const { setFirestore } = require('../src/firestore');
  setFirestore(fakeDb);
  const { saveClientProfile } = require('../src/crm');
  await saveClientProfile({ email: 'user@example.com', fullName: 'User' });
  const saved = fakeDb.store['user@example.com'];
  assert.ok(saved);
  assert.strictEqual(saved.fullName, 'User');
  assert.strictEqual(saved.source, 'onboarding-wizard');
  assert.ok(saved.createdAt);
});
