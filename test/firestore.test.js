const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

// Helper to create a simple in-memory Firestore stub
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
                async add(task) {
                  store[userId] = store[userId] || [];
                  store[userId].push(task);
                  return { id: String(store[userId].length) };
                },
                async get() {
                  const tasks = store[userId] || [];
                  return {
                    docs: tasks.map((t, i) => ({
                      id: String(i + 1),
                      data: () => t,
                    })),
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

test('saveTask stores tasks and listTasks retrieves them', async () => {
  // Prepare fake Firestore and module
  const fakeDb = createFakeFirestore();
  process.env.FIREBASE_ADMIN_KEY_PATH = path.resolve(__dirname, 'fixtures', 'serviceAccount.json');

  delete require.cache[require.resolve('../src/firestore')];
  const { saveTask, listTasks, setFirestore } = require('../src/firestore');
  setFirestore(fakeDb);

  await saveTask('user1', { title: 'Task 1' });
  await saveTask('user1', { title: 'Task 2' });

  const tasks = await listTasks('user1');
  assert.strictEqual(tasks.length, 2);
  assert.strictEqual(tasks[0].title, 'Task 1');
  assert.strictEqual(tasks[1].title, 'Task 2');
});
