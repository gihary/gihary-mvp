const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

function createFakeFirestore() {
  const store = { logs: {} };
  return {
    store,
    collection(name) {
      if (name === 'clients') {
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
                      async get() {
                        const data = store[userId];
                        if (!data) return { exists: false };
                        return { exists: true, data: () => data };
                      },
                      id: 'profile',
                    };
                  },
                };
              },
            };
          },
        };
      }
      if (name === 'logs') {
        return {
          doc(uid) {
            store.logs[uid] = store.logs[uid] || [];
            return {
              collection() {
                return {
                  async add(data) {
                    store.logs[uid].push(data);
                    return { id: String(store.logs[uid].length) };
                  },
                };
              },
            };
          },
        };
      }
    },
  };
}

function createFirestoreWithBackup() {
  const store = { logs: {} };
  return {
    store,
    collection(name) {
      if (name === 'clients') {
        return {
          doc(email) {
            store[email] = store[email] || { profile: null, backup: null };
            return {
              collection(col) {
                if (col === 'profile') {
                  return {
                    doc() {
                      return {
                        async set(data) {
                          store[email].profile = data;
                        },
                        async get() {
                          const data = store[email].profile;
                          if (!data) return { exists: false };
                          return { exists: true, data: () => data };
                        },
                      };
                    },
                  };
                }
                if (col === 'backup') {
                  return {
                    doc() {
                      return {
                        async set(data) {
                          store[email].backup = data;
                        },
                        async get() {
                          const data = store[email].backup;
                          if (!data) return { exists: false };
                          return { exists: true, data: () => data };
                        },
                      };
                    },
                  };
                }
              },
            };
          },
        };
      }
      if (name === 'logs') {
        return {
          doc(uid) {
            store.logs[uid] = store.logs[uid] || [];
            return {
              collection(col) {
                if (col === 'events') {
                  return {
                    async add(data) {
                      store.logs[uid].push(data);
                      return { id: String(store.logs[uid].length) };
                    },
                  };
                }
              },
            };
          },
        };
      }
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

test('saveClientProfile backs up existing profile and logs event', async () => {
  const fakeDb = createFirestoreWithBackup();
  fakeDb.store['user@example.com'] = {
    profile: { fullName: 'Old User' },
    backup: null,
  };
  process.env.FIREBASE_ADMIN_KEY_PATH = path.resolve(__dirname, 'fixtures', 'serviceAccount.json');
  delete require.cache[require.resolve('../src/firestore')];
  const { setFirestore } = require('../src/firestore');
  setFirestore(fakeDb);
  delete require.cache[require.resolve('../src/crm')];
  delete require.cache[require.resolve('../src/logger')];
  const { saveClientProfile } = require('../src/crm');
  await saveClientProfile({ email: 'user@example.com', fullName: 'New User' });
  const store = fakeDb.store['user@example.com'];
  assert.strictEqual(store.backup.fullName, 'Old User');
  assert.strictEqual(store.profile.fullName, 'New User');
  const events = fakeDb.store.logs['user@example.com'];
  assert.strictEqual(events.length, 1);
  assert.strictEqual(events[0].action, 'profile_saved');
});
