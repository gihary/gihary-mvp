const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

function createFakeFirestore() {
  const store = {};
  return {
    store,
    collection(name) {
      if (name !== 'core_memory') throw new Error('Unexpected collection');
      return {
        doc(id) {
          store[id] = store[id] || { info: null };
          return {
            collection(col) {
              if (col !== 'info') throw new Error('Unexpected subcollection');
              return {
                doc() {
                  return {
                    async get() {
                      const data = store[id].info;
                      if (!data) return { exists: false };
                      return { exists: true, data: () => data };
                    },
                async set(data, opts = {}) {
                      if (opts.merge && store[id].info) {
                        const merged = { ...store[id].info };
                        for (const [k, v] of Object.entries(data)) {
                          if (v !== undefined) merged[k] = v;
                        }
                        store[id].info = merged;
                      } else {
                        store[id].info = data;
                      }
                    },
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

test('saveToCore stores new document', async () => {
  const fakeDb = createFakeFirestore();
  process.env.FIREBASE_ADMIN_KEY_PATH = path.resolve(__dirname, 'fixtures', 'serviceAccount.json');
  delete require.cache[require.resolve('../src/firestore')];
  const { setFirestore } = require('../src/firestore');
  setFirestore(fakeDb);
  delete require.cache[require.resolve('../src/core')];
  const { saveToCore } = require('../src/core');
  await saveToCore({ email: 'user@example.com', nome: 'User', ultimi_intenti: [] });
  const stored = fakeDb.store['user@example.com'].info;
  assert.strictEqual(stored.nome, 'User');
  assert.ok(Array.isArray(stored.ultimi_intenti));
});

test('saveToCore merges existing document', async () => {
  const fakeDb = createFakeFirestore();
  fakeDb.store['user@example.com'] = { info: { nome: 'Old', parole_chiave: ['a'], extra: 1 } };
  process.env.FIREBASE_ADMIN_KEY_PATH = path.resolve(__dirname, 'fixtures', 'serviceAccount.json');
  delete require.cache[require.resolve('../src/firestore')];
  const { setFirestore } = require('../src/firestore');
  setFirestore(fakeDb);
  delete require.cache[require.resolve('../src/core')];
  const { saveToCore } = require('../src/core');
  await saveToCore({ email: 'user@example.com', nome: 'New', priorità_media: 5 });
  const stored = fakeDb.store['user@example.com'].info;
  assert.strictEqual(stored.nome, 'New');
  assert.deepStrictEqual(stored.parole_chiave, ['a']);
  assert.strictEqual(stored.priorità_media, 5);
  assert.strictEqual(stored.extra, 1);
});
