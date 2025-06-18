const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

function createFakeFirestore(backupData = {}) {
  const store = {};
  if (backupData.email) {
    store[backupData.email] = {
      backup: backupData.data,
      profile: null,
    };
  }
  return {
    store,
    collection() {
      return {
        doc(email) {
          store[email] = store[email] || { backup: null, profile: null };
          return {
            collection(name) {
              if (name === 'backup') {
                return {
                  doc() {
                    return {
                      async get() {
                        const data = store[email].backup;
                        if (!data) return { exists: false };
                        return { exists: true, data: () => data };
                      },
                    };
                  },
                };
              }
              if (name === 'profile') {
                return {
                  doc() {
                    return {
                      async set(data) {
                        store[email].profile = data;
                      },
                    };
                  },
                };
              }
            },
          };
        },
      };
    },
  };
}

test('rollbackClientProfile copies backup to active profile', async () => {
  const fakeDb = createFakeFirestore({
    email: 'user@example.com',
    data: { fullName: 'Backup User' },
  });
  process.env.FIREBASE_ADMIN_KEY_PATH = path.resolve(__dirname, 'fixtures', 'serviceAccount.json');
  delete require.cache[require.resolve('../src/firestore')];
  const { setFirestore } = require('../src/firestore');
  setFirestore(fakeDb);
  delete require.cache[require.resolve('../src/rollback')];
  const { rollbackClientProfile } = require('../src/rollback');
  await rollbackClientProfile('user@example.com');
  assert.deepStrictEqual(fakeDb.store['user@example.com'].profile, { fullName: 'Backup User' });
});

test('rollbackClientProfile throws when no backup exists', async () => {
  const fakeDb = createFakeFirestore();
  process.env.FIREBASE_ADMIN_KEY_PATH = path.resolve(__dirname, 'fixtures', 'serviceAccount.json');
  delete require.cache[require.resolve('../src/firestore')];
  const { setFirestore } = require('../src/firestore');
  setFirestore(fakeDb);
  delete require.cache[require.resolve('../src/rollback')];
  const { rollbackClientProfile } = require('../src/rollback');
  await assert.rejects(
    rollbackClientProfile('user@example.com'),
    /No backup found/,
  );
});

